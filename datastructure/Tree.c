#include <stdio.h>

struct Node {
	int value;
	struct Node* left;
	struct Node* right;
};
typedef struct Node Node;

Node NULL_NODE;
Node* resultPtr;
Node* find(Node* node, int value) {
	if (node == NULL) {
		return NULL;
	}
	// 찾는 노드가 해당 노드일 경우 반환
	if (node->value == value) {
		//printf("Find node at %p\n", node);
		return node;
	}
	// 왼쪽 노드가 있다면 탐색
	resultPtr = find(node->left, value);
	if (resultPtr == NULL) { // 왼쪽 노드에서 찾지 못을 경우
		// 오른쪽 노드가 있다면 탐색
		resultPtr = find(node->right, value);
	}
	return resultPtr;
}

void mai() {
	//root-L
	Node tree4 = { 5, NULL, NULL };
	Node tree3 = { 2, NULL, NULL };
	Node tree1 = { 3, &tree3, &tree4 };
	//root-R
	Node tree7 = { 16, NULL, NULL };
	Node tree6 = { 11, NULL, NULL };
	Node tree5 = { 14, &tree6, &tree7 };
	Node tree2 = { 10, NULL, &tree5 };
	//root
	Node root = { 8, &tree1, &tree2 };
	
	printf("Origin:\t%p\n", &tree5);
	printf("Found:\t%p\n", find(&root, 14));
}