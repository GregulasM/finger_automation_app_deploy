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

export function normalizeWorkflowSteps(graphData: unknown): WorkflowStep[] {
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

    const actionNodes = nodes
      .map((node, index) => {
        const nodeData = (node.data ?? {}) as Record<string, unknown>;
        const role = String(nodeData.role ?? "")
          .toLowerCase()
          .trim();
        const rawType = String(
          nodeData.actionType ?? nodeData.type ?? node.type ?? "Transformation",
        );
        if (role === "trigger") {
          return null;
        }
        if (TRIGGER_NODE_TYPES.has(rawType.toLowerCase().trim())) {
          return null;
        }
        return { node, nodeData, rawType, index };
      })
      .filter(
        (
          item,
        ): item is {
          node: Record<string, unknown>;
          nodeData: Record<string, unknown>;
          rawType: string;
          index: number;
        } => item !== null,
      );

    const actionIds = new Set(
      actionNodes.map((item) => String(item.node.id ?? item.index)),
    );

    const orderedNodes =
      edges.length > 0
        ? topologicalSort(actionNodes, actionIds, edges)
        : actionNodes;

    return orderedNodes
      .map((item, orderIndex) => {
        const id = String(item.node.id ?? item.index);
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
    node: Record<string, unknown>;
    nodeData: Record<string, unknown>;
    rawType: string;
    index: number;
  }[],
  actionIds: Set<string>,
  edges: Record<string, unknown>[],
) {
  const nodeById = new Map<string, (typeof actionNodes)[number]>();
  for (const item of actionNodes) {
    const id = String(item.node.id ?? item.index);
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
