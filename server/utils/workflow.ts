export type WorkflowStepType =
  | "HTTP Request"
  | "Email"
  | "Telegram"
  | "Database"
  | "Transformation";

export type WorkflowStep = {
  key: string;
  type: WorkflowStepType;
  order: number;
  config?: Record<string, unknown>;
  timeoutMs?: number;
};

const STEP_TYPE_MAP: Record<string, WorkflowStepType> = {
  "http request": "HTTP Request",
  http: "HTTP Request",
  webhook: "HTTP Request",
  email: "Email",
  telegram: "Telegram",
  database: "Database",
  db: "Database",
  transformation: "Transformation",
  transform: "Transformation",
  filter: "Transformation",
};

const TRIGGER_NODE_TYPES = new Set(["webhook", "schedule", "cron", "email"]);

function normalizeType(raw: string): WorkflowStepType {
  const key = raw.toLowerCase().trim();
  return STEP_TYPE_MAP[key] ?? (raw as WorkflowStepType);
}

export function normalizeWorkflowSteps(
  graphData: unknown,
  source?: string,
): WorkflowStep[] {
  if (!graphData || typeof graphData !== "object") {
    return [];
  }

  const data = graphData as Record<string, unknown>;

  if (Array.isArray(data.steps)) {
    return data.steps
      .map((step, index) => {
        const record = step as Record<string, unknown>;
        const rawType = String(
          record.type ?? record.actionType ?? "Transformation",
        );
        if (TRIGGER_NODE_TYPES.has(rawType.toLowerCase().trim())) {
          return null;
        }
        return {
          key: String(record.key ?? record.id ?? index),
          type: normalizeType(rawType),
          order: Number(record.order ?? index + 1),
          config: (record.config ?? record.data ?? {}) as Record<
            string,
            unknown
          >,
          timeoutMs:
            typeof record.timeoutMs === "number" ? record.timeoutMs : undefined,
        };
      })
      .filter((step): step is WorkflowStep => step !== null);
  }

  if (Array.isArray(data.nodes)) {
    const nodes = data.nodes as Record<string, unknown>[];
    const edges = Array.isArray(data.edges)
      ? (data.edges as Record<string, unknown>[])
      : [];

    const graphNodes = nodes.map((node, index) => {
      const nodeData = (node.data ?? {}) as Record<string, unknown>;
      const role = String(nodeData.role ?? "")
        .toLowerCase()
        .trim();
      const rawType = String(
        nodeData.actionType ?? nodeData.type ?? node.type ?? "Transformation",
      );
      return {
        id: String(node.id ?? index),
        node,
        nodeData,
        rawType,
        role,
        index,
      };
    });

    const reachableActionIds = getReachableActionIds(graphNodes, edges, source);

    const actionNodes = graphNodes
      .map((item) => {
        const rawType = item.rawType;

        // Skip trigger nodes
        if (item.role === "trigger") {
          return null;
        }

        // Only filter by TRIGGER_NODE_TYPES if role is not explicitly "action"
        // This allows Email ACTION nodes to pass through even though "email" is in TRIGGER_NODE_TYPES
        if (
          item.role !== "action" &&
          TRIGGER_NODE_TYPES.has(rawType.toLowerCase().trim())
        ) {
          return null;
        }

        if (reachableActionIds && !reachableActionIds.has(item.id)) {
          return null;
        }

        return item;
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          node: Record<string, unknown>;
          nodeData: Record<string, unknown>;
          rawType: string;
          role: string;
          index: number;
        } => item !== null,
      );

    const actionIds = new Set(actionNodes.map((item) => item.id));

    const orderedNodes =
      edges.length > 0
        ? topologicalSort(actionNodes, actionIds, edges)
        : actionNodes;

    return orderedNodes
      .map((item, orderIndex) => {
        const id = item.id;
        const data = item.nodeData;
        return {
          key: id,
          type: normalizeType(item.rawType),
          order: Number(data.order ?? orderIndex + 1),
          config: (data.config ?? data) as Record<string, unknown>,
          timeoutMs:
            typeof data.timeoutMs === "number" ? data.timeoutMs : undefined,
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  return [];
}

function topologicalSort(
  actionNodes: {
    id: string;
    node: Record<string, unknown>;
    nodeData: Record<string, unknown>;
    rawType: string;
    role: string;
    index: number;
  }[],
  actionIds: Set<string>,
  edges: Record<string, unknown>[],
) {
  const nodeById = new Map<string, (typeof actionNodes)[number]>();
  for (const item of actionNodes) {
    const id = item.id;
    nodeById.set(id, item);
  }

  const indegree = new Map<string, number>();
  const adjacency = new Map<string, Set<string>>();
  for (const id of actionIds) {
    indegree.set(id, 0);
    adjacency.set(id, new Set());
  }

  for (const edge of edges) {
    const source = String(edge.source ?? "");
    const target = String(edge.target ?? "");
    if (!actionIds.has(source) || !actionIds.has(target)) {
      continue;
    }
    adjacency.get(source)?.add(target);
    indegree.set(target, (indegree.get(target) ?? 0) + 1);
  }

  const queue = Array.from(actionIds)
    .filter((id) => (indegree.get(id) ?? 0) === 0)
    .sort((a, b) => {
      const orderA = Number(nodeById.get(a)?.nodeData.order ?? 0);
      const orderB = Number(nodeById.get(b)?.nodeData.order ?? 0);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return (nodeById.get(a)?.index ?? 0) - (nodeById.get(b)?.index ?? 0);
    });

  const result: (typeof actionNodes)[number][] = [];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id) {
      continue;
    }
    const item = nodeById.get(id);
    if (item) {
      result.push(item);
    }
    for (const neighbor of adjacency.get(id) ?? []) {
      const next = (indegree.get(neighbor) ?? 0) - 1;
      indegree.set(neighbor, next);
      if (next === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== actionNodes.length) {
    return actionNodes;
  }
  return result;
}

function normalizeTriggerType(raw: string) {
  const key = raw.toLowerCase().trim();
  if (key === "cron" || key === "schedule") {
    return "schedule";
  }
  return key;
}

function normalizeTriggerSource(source?: string) {
  if (!source) {
    return "";
  }
  return normalizeTriggerType(String(source));
}

function getReachableActionIds(
  nodes: {
    id: string;
    role: string;
    rawType: string;
  }[],
  edges: Record<string, unknown>[],
  source?: string,
) {
  const triggerType = normalizeTriggerSource(source);
  if (!triggerType || edges.length === 0) {
    return null;
  }

  const triggerIds = nodes
    .filter(
      (node) =>
        node.role === "trigger" &&
        normalizeTriggerType(node.rawType) === triggerType,
    )
    .map((node) => node.id);

  if (triggerIds.length === 0) {
    return null;
  }

  const adjacency = new Map<string, Set<string>>();
  for (const edge of edges) {
    const sourceId = String(edge.source ?? "");
    const targetId = String(edge.target ?? "");
    if (!sourceId || !targetId) {
      continue;
    }
    if (!adjacency.has(sourceId)) {
      adjacency.set(sourceId, new Set());
    }
    adjacency.get(sourceId)?.add(targetId);
  }

  const visited = new Set<string>(triggerIds);
  const queue = [...triggerIds];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }
    for (const neighbor of adjacency.get(current) ?? []) {
      if (visited.has(neighbor)) {
        continue;
      }
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  const reachableActionIds = new Set(
    nodes
      .filter((node) => node.role === "action" && visited.has(node.id))
      .map((node) => node.id),
  );

  return reachableActionIds;
}
