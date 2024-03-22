/* eslint-disable no-undef */


export function processPayment(cart) {
    const resultElement = document.getElementById("result");
    const modal = document.getElementById("resultModal");
    resultElement.innerHTML = ""

    async function createOrder() {
        const { id } = await fetch(`/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart)
          }).then((res) => res.json());
        console.log(" ===== Order Created ===== ", id);
        return id;
    }
    async function captureOrder(data) {
        console.log(data)
        const response = await fetch(`/api/orders/${data.orderID}/capture`, {
            method: "POST"
          }).then(res => res.json())
  
          console.log(" ===== Order Capture Completed ===== ")
          modal.style.display = "block";
          resultElement.innerHTML = prettyPrintJson.toHtml(response, {
            indent: 2
          });
          return response
    }

    return {
        createOrder,
        captureOrder
    }
}