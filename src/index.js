const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const request = require("request");
const { join } = require("path");
const app = express();

const token = "26af6707a50d0534ae8144fef598de7d51458f63";
const apiGetChallenge = `https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`;
const apiSubmitSolution = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`;
const fs = require("fs");

app.use(express.json());

app.listen(3333);

const getChallengeData = async () => {
  const { data } = await axios.get(apiGetChallenge);
  //fs.writeFile("answer.json", JSON.stringify(data), _ => {});
  return data;
};

getChallengeData().then(challenge => {
  const { cifrado, numero_casas } = challenge;

  let decrypted = [];
  let textDecrypted = "";
  let hash = "";

  // Decifrando a mensagem
  cifrado.split("").forEach(val => {
    if (val.charCodeAt(0) >= "97" && val.charCodeAt(0) <= "122") {
      if (val.charCodeAt(0) - numero_casas < 97) {
        decrypted.push(String.fromCharCode(122 - (numero_casas - 1)));
      } else {
        decrypted.push(String.fromCharCode(val.charCodeAt(0) - numero_casas));
      }
    } else {
      decrypted.push(val);
    }
  });

  textDecrypted = decrypted.join("");

  // Criando resumo criptográfico
  hash = crypto
    .createHash("sha1")
    .update(textDecrypted, "utf8")
    .digest("hex");

  // preparando dados para escrita
  const final = {
    numero_casas: challenge.numero_casas,
    token: challenge.token,
    cifrado: challenge.cifrado,
    decifrado: textDecrypted,
    resumo_criptografico: hash
  };

  // Escrevendo os resultados no arquivo
  //fs.writeFile("./answer.json", JSON.stringify(final), err => {
  //  if (err) throw err;
  //});

  async function submit() {
    const newAnswer = fs.createReadStream(join(__dirname, "../answer.json"));
    console.log(newAnswer);

    await request(
      {
        method: "POST",
        url: apiSubmitSolution,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          answer: newAnswer
        }
      },
      (err, res, body) => {
        if (err) {
          console.log(err);
        }

        console.log(body);
      }
    );
  }

  submit().then(res => {
    console.log(res);
  });
});

/**
 * vjg pkeg vjkpi cdqwv uvcpfctfu ku vjcv vjgtg ctg uq ocpa vq ejqqug htqo. wpmpqyp
 * the nice thing about standards is that there are so many_to choose from. unknown
 */
