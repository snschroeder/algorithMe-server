const listHelpers = {

  isEmpty(linkedList) {
    return !linkedList.head;
  },

  findPreviousId(linkedList, id) {
    let prevNode = linkedList.head;
    let currNode = linkedList.head;
    if (!linkedList.head) {
      return null;
    }
    while (currNode.value.id !== id) {
      if (currNode.next === null) {
        return null
      } else {
        prevNode = currNode;
        currNode = currNode.next;
      }
    }
    return prevNode.value.id
  },


  find(linkedList, id) {

    let currNode = linkedList.head;
    if (!linkedList.head) {
      return null;
    }
    while (currNode.value.id !== id) {
      if (currNode.next === null) {
        return null
      } else {
        currNode = currNode.next;
      }
    }

    return currNode.value
  }
}

module.exports = listHelpers