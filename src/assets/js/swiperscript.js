function initializeSwiper() {
  var swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,
    coverflowEffect: {
      rotate: 30,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    perSlideOffset: 10,
    perSlideRotate: 10,
    speed: 600,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        var name;
        var gif;
        if (index == 0) {
          name = "مندوب";
          gif = "../assets/loginGIFs/Home-Delivery.gif";
        } else if (index == 1) {
          name = "موظف";
          gif = "../assets/loginGIFs/User-Dashboard.gif";
        } else {
          name = "تاجر";
          gif = "../assets/loginGIFs/Merchant-tenant-trusted.gif";
        }
        return '<button type="button" class="btns-switch btn-container ' + className + '"><img width="80px" height="80px" class="gif-login" src="./gif/' + gif + '" alt="Awesome GIF">' + name + '</button>';
      },
    },
  });
}
