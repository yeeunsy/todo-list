export default (err, req, res, next) => {
  console.log("에러처리 미들웨어 실행");
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ errorMessage: err.message });
  }

  return res.status(500).json({ errorMessage: "서버 에러 발생" });
};
