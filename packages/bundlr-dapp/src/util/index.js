export const getAvatar = (str) => {
    return `https://gravatar.com/avatar/${str}?d=identicon&r=x`;
}

const axios = require('axios');

export const pinJSONToIPFS = (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: "f713925394e00840af3b",
                pinata_secret_api_key: "818a3f339b8c1a42cb2950e2682b66a64648566a2c6283edf957d64438638172"
            }
        })
        .then((resp) => {
            return `https://gateway.pinata.cloud/ipfs/${resp.data.IpfsHash}`
        })
        .catch((err) => {
            console.log(err)
            return ""
        });
}
