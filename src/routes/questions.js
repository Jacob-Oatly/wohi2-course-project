const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma")
const questions = require("../data/questions");
/*
router.get("/", (req, res) => {
    res.json(questions);
});
*/

const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");


router.use(authenticate);

router.get("/", async (req, res) => {
    const {keyword} = req.query;

    const { keyword } = req.query;

    const where = keyword
        ? { keywords: { some: { name: keyword } } }
        : {};
    
    const posts = await prisma.question.findMany({
        where,
        include: { keywords: true },
        orderBy: { id: "asc" },
    });

    //res.json(questions.map(formatQuestion));
    res.json(filteredQuestions);


    /*
    if (!keyword) {
        return res.json(questions);
    }
        */

    /*
    const filteredQuestions = questions.filter(question => 
        question.keywords.includes(keyword.toLowerCase())
    );

    res.json(filteredQuestions);
    */
});

router.get("/:questionId", isOwner, async (req, res) => {
  const questionId = Number(req.params.questionId);
  const post = await prisma.post.findUnique({
    where: { id: questionId },
    include: { keywords: true },
  });

  if (!question) {
    return res.status(404).json({ 
		message: "Question not found" 
    });
  }


    /*
    const questionId = Number(req.params.questionId);
    const question = questions.find(q=>q.id === questionId);

    if (!question) {
        return res.status(404).json({msg: "Question not found"});
    }
    */

    res.json(question);
});

router.post("/", isOwner, async (req, res) => {
  const { questionTitle, answer, keywords } = req.body;

    if (!questionTitle || !answer) {
    return res.status(400).json({ msg: 
	"Question and answer are required" });
  }

  const keywordsArray = Array.isArray(keywords) ? keywords : [];

  const newQuestion = await prisma.question.create({
      data: {
        questionTitle: question.questionTitle,
        answer: question.answer,
        userId: req.user.userId,
        keywords: {
          connectOrCreate: question.keywords.map((kw) => ({
            where: { name: kw },
            create: { name: kw },
          })),
        },
      },
    include: { keywords: true },
  });


    /*
    const {questionTitle, answer, keywords} = req.body;

    if (!questionTitle || !answer) {
        return res.status(400).json ({
            message: "Question and answer are required"
        });
    }

    const maxId = Math.max(...questions.map (q => q.id), 0);

    const newQuestion = {
        id: questions.length ? maxId + 1 : 1,
        questionTitle, answer,
        keywords: Array.isArray(keywords) ? keywords : []
    };
    questions.push(newQuestion);
    */


    res.status(201).json(newQuestion);
});


router.put("/:questionId", isOwner, async (req, res) => {

  const questionId = Number(req.params.questionId);
  const { questionTitle, answer, keywords } = req.body;
  const existingQuestion = await prisma.question.findUnique({ where: { id: questionId } });
  if (!existingQuestion) {
    return res.status(404).json({ message: "Question not found" });
  }

    if (!questionTitle || !answer) {
    return res.status(400).json({ msg: "Question and answer are required" });
  }

  const keywordsArray = Array.isArray(keywords) ? keywords : [];
  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
      data: {
        questionTitle: question.questionTitle,
        answer: question.answer,
        keywords: {
          connectOrCreate: question.keywords.map((kw) => ({
            where: { name: kw },
            create: { name: kw },
          })),
        },
      },
    include: { keywords: true },
  });

    res.json(question);
});


router.delete("/:questionId", isOwner, async (req, res) => {
  const questionId = Number(req.params.postId);

  const question = await prisma.post.findUnique({
    where: { id: questionId },
    include: { keywords: true },
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  await prisma.question.delete({ where: { id: questionId } });

    res.json({
        message: "Question deleted successfully",
        question: deletedQuestion[0]
    });
});

module.exports = router;