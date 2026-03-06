var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users');

// Lưu ý: Các route cố định (/enable, /disable) phải đặt TRƯỚC các route có tham số động (/:id) để tránh xung đột.

router.post('/enable', async function (req, res, next) {
  try {
    let email = req.body.email;
    let username = req.body.username;
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (result) res.status(200).send({ message: "Kích hoạt thành công", status: result.status });
    else res.status(400).send({ message: "Thông tin không khớp" });
  } catch (error) { res.status(500).send({ message: error.message }); }
});

router.post('/disable', async function (req, res, next) {
  try {
    let email = req.body.email;
    let username = req.body.username;
    let result = await userSchema.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (result) res.status(200).send({ message: "Vô hiệu hóa thành công", status: result.status });
    else res.status(400).send({ message: "Thông tin không khớp" });
  } catch (error) { res.status(500).send({ message: error.message }); }
});

router.get('/', async function (req, res, next) {
  try {
    let data = await userSchema.find({ isDeleted: false }).populate('role');
    res.send(data);
  } catch (error) { res.status(500).send({ message: error.message }); }
});

router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (result) res.status(200).send(result);
    else res.status(404).send({ message: "ID NOT FOUND" });
  } catch (error) { res.status(404).send({ message: "ID NOT FOUND" }); }
});

router.post('/', async function (req, res, next) {
  try {
    let newObj = new userSchema(req.body);
    await newObj.save();
    res.send(newObj);
  } catch (error) { res.status(400).send({ message: error.message }); }
});

router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, req.body, { new: true }
    );
    if (result) res.status(200).send(result);
    else res.status(404).send({ message: "ID NOT FOUND" });
  } catch (error) { res.status(404).send({ message: "ID NOT FOUND" }); }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(
      req.params.id, { isDeleted: true }, { new: true }
    );
    if (result) res.status(200).send(result);
    else res.status(404).send({ message: "ID NOT FOUND" });
  } catch (error) { res.status(404).send({ message: "ID NOT FOUND" }); }
});

module.exports = router;