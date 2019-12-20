const LinkedList = require('../linked-list/LinkedList');
const listHelpers = require('../linked-list/linkedListHelpers');


const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getHead(db, user_id) {
    return db
      .from('language').where('language.user_id', '=', user_id)
      .join('word', function () {
        this.on('word.id', '=', 'language.head')
      })
  },

  getUsersWords(db, user_id) {
    return db
      .from('language').where('language.user_id', '=', user_id)
      .join('word', function () {
        this.on('language.id', '=', 'word.language_id')
      })
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  async revGenLinkedList(language, words) {

    const ll = new LinkedList();
    ll.id = language.id;
    ll.name = language.name;
    ll.total_score = language.total_score;
    let word = words.find(w => w.id === language.head)
    ll.insertFirst({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    })
    while (word.next) {
      word = words.find(w => w.id === word.next)
      ll.insertLast({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      })
    }
    return ll

  },

  async updateDBTotalScore(db, langId, totalScore) {
    let newScore = totalScore + 1
    return await db('language')
      .where('id', langId)
      .update({ total_score: newScore })
  },

  // spaced rep algorithm
  updateLinkedList(wasCorrect, linkedList, db) {

    if (wasCorrect) {
      this.updateDBTotalScore(db, linkedList.id, linkedList.total_score)
      linkedList.total_score++
      linkedList.head.value.memory_value *= 2;

      linkedList.head.value.correct_count++;

    } else {
      linkedList.head.value.memory_value = 1;
      linkedList.head.value.incorrect_count++;
    }


    linkedList.insertAt(linkedList.head.value, linkedList.head.value.memory_value)

    this.updateMovedWordDatabase(db, linkedList.head.value.id, linkedList.head.value.memory_value, linkedList.head.value.correct_count, linkedList.head.value.incorrect_count, linkedList.head.value.next)

    let updatedNext = linkedList.head.value.id

    //.remove returns the id of the node it st removed
    let idRemoved = linkedList.remove(linkedList.head.value)

    let changeNextId = listHelpers.findPreviousId(linkedList, idRemoved)

    this.updateBeforeMovedWordDatabase(db, changeNextId, updatedNext)

    return linkedList
  },

  async updateMovedWordDatabase(db, wordId, mvalue, correctC, incorrectC, next) {
    return await db('word')
      .where('id', wordId)
      .update({
        memory_value: mvalue,
        correct_count: correctC,
        incorrect_count: incorrectC,
        next: next
      })
  },


  async updateBeforeMovedWordDatabase(db, wordId, updatedNext) {
    return await db('word')
      .where('id', wordId)
      .update({
        next: updatedNext
      })
  },

  async updateLanguageDatabase(db, linkedList, user_id) {
    return await db('language')
      .where('user_id', user_id)
      .update({ head: linkedList.head.value.id })
  },



}



module.exports = LanguageService
