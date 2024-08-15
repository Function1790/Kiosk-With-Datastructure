#include <stdio.h>

int heap[100];
int peak = -1;

static int Left(int parentIndex) { return parentIndex * 2; }
static int Right(int parentIndex) { return parentIndex * 2 + 1; }
static int Parent(int childIndex) { return childIndex / 2; }

int _temp;
void swap(int* A, int* B) {
	_temp = *B;
	*B = *A;
	*A = _temp;
}

int parentIndex;
void heapify(int* heap[], int currentIndex) {
	parentIndex = Parent(peak);
	if (*heap[parentIndex] < *heap[peak]) {
		swap(heap[parentIndex], heap[peak]);
		//heapify(heap, )
	}
}

void insert(int* heap[], int value) {
	*heap[++peak] = value;
}


void mai() {
	heap[0] = 0;
	heap[1] = 1;
	swap(heap[0], heap[1]);
	printf("data: %d %d", heap[0], heap[1]);
}