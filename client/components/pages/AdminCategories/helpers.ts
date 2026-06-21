import { Category, CategoryNode } from "./types";

export function buildTree(flat: Category[]): CategoryNode[] {
  const map = new Map<number, CategoryNode>();
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: CategoryNode[] = [];
  map.forEach((node) => {
    if (node.parent_id === null) {
      roots.push(node);
    } else {
      const parent = map.get(node.parent_id);
      if (parent) {
        parent.children.push(node);
        parent.children.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      }
    }
  });
  roots.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return roots;
}

// Recursive flat list of options with visual indentation
export function flattenForSelect(
  nodes: CategoryNode[],
  depth = 0,
  excludeId?: number
): { id: number; label: string }[] {
  const result: { id: number; label: string }[] = [];
  nodes.forEach((node) => {
    if (node.id === excludeId) return; // exclude self from parent list
    result.push({
      id: node.id,
      label: `${"─".repeat(depth > 0 ? depth : 0)}${depth > 0 ? " " : ""}${node.name}`,
    });
    if (node.children.length > 0) {
      result.push(...flattenForSelect(node.children, depth + 1, excludeId));
    }
  });
  return result;
}
