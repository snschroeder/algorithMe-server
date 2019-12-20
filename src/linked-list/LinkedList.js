const Node = require('./Node');

class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new Node(item, this.head);
  }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }
    let tempNode = this.head;
    while (tempNode.next !== null) {
      tempNode = tempNode.next;
    }
    tempNode.next = new Node(item, null)
  }

  insertAfter(item, itemAfter) {
    if (!this.head) {
      this.insertLast(item);
    }
    let currNode = this.head;
    let currPlusOne = this.head;

    while (currNode !== null && currNode.value !== itemAfter) {
      currNode = currNode.next;
      currPlusOne = currNode.next;
    }
    if (currNode === null) {
      this.insertLast(item);
      return;
    }
    currNode.next = new Node(item, currPlusOne)
  }

  size() {
    if (!this.head) {
      return 0
    }
    let currNode = this.head.next;
    let currPos = 1;
    while(currNode) {
      currNode = currNode.next;
      currPos += 1;
    }

    return currPos;
  }

  insertAt(item, pos) {

    if(pos > this.size()) {
        return this.insertLast(item)
      }
    if (!this.head) {
      this.insertFirst(item);
    }

    let prevNode = this.head;
    let currNode = this.head;
    let currPos = 1;

    while (currPos <= pos + 1 && currNode !== null) {


      prevNode = currNode;
      currNode = currNode.next;
      currPos += 1;
    }

    prevNode.next = new Node(item, currNode);

    prevNode.value.next = prevNode.next.value.id

    prevNode.next.value.next = prevNode.next.next.value.id
   
  }


  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  remove(item) {

    let removedNode
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      removedNode = this.head.value.id
      this.head = this.head.next;
      return removedNode;
    }
    let currNode = this.head;
    let prevNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    prevNode.next = currNode.next;
  }
}

module.exports = LinkedList;
