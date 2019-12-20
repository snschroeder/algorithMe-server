const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const listHelpers = require('../linked-list/linkedListHelpers')

const languageRouter = express.Router();
const bodyParser = express.json();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const headWord = await LanguageService.getHead(
        req.app.get('db'),
        req.user.id
      )
      res.json({
        nextWord: headWord[0].original,
        totalScore: headWord[0].total_score,
        wordCorrectCount: headWord[0].correct_count,
        wordIncorrectCount: headWord[0].incorrect_count
      })
      res.send('blah')
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .use(bodyParser)
  .post('/guess', async (req, res, next) => {
    try {

      
      const { guess } = req.body;

      if(!guess) {
        return res.status(400).json({
          error: "Missing 'guess' in request body"
        })
      }
      let language =  await LanguageService.getUsersLanguage(req.app.get('db'), req.user.id)
      let words = await LanguageService.getLanguageWords(req.app.get('db'), language.id)

      const altList = await LanguageService.revGenLinkedList(language,words)

      let currentQid = altList.head.value.id
      const verdict = guess === altList.head.value.translation;
      const updatedList = LanguageService.updateLinkedList(verdict, altList, req.app.get('db'));
      
      LanguageService.updateLanguageDatabase(req.app.get('db'), updatedList, req.user.id)
     
      let values = listHelpers.find(updatedList, currentQid)

      res.json({
        answer: values.translation,
        isCorrect: verdict,
        nextWord: updatedList.head.value.original,
        totalScore: updatedList.total_score,
        wordCorrectCount: updatedList.head.value.correct_count,//values.correct_count,
        wordIncorrectCount: updatedList.head.value.incorrect_count//values.incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }
    res.send('implement me!')
  })

module.exports = languageRouter
