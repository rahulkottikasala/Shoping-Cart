const { response } = require("express")
const { post } = require("../../routes/users")


function addToCart(proId) {
  $.ajax({
    url: '/add-to-cart/' + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $('#cart-count').html()
        count = parseInt(count) + 1
        $("#cart-count").html(count)
      }

    }
  })
}

function changeQuantity(cartId,proId,count){
  count = parseInt(count)
  let quantity = parseInt(document.getElementById(proId).innerHTML)
    $.ajax({
      url : '/change-product-quantity',
      data : {
        cart : cartId,
        product : proId,
        count : count,
        quantity : quantity
      },
      method: 'post',
      success : (response) => {
      if(response.removeProduct){
        alert('Product Removed from cart')
        window.location.reload(true);
      }else{
        document.getElementById(proId).innerHTML = quantity+count
      }
       
      }
    })
  }

  function removeCartProduct (cartId,proId){
    $.ajax({
      url : '/remove-cart-product',
      data : {
        cart : cartId,
        product : proId
      },
      method : 'post',
      success : (response) => {
        if(response){
          alert('Product Removed from cart')
        window.location.reload(true);
        }
        
      }

    })
  }