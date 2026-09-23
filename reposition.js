$(".sf-about").click(function() {
  $("html,body").animate(
    {
      scrollTop: $(".second").offset().top
    },
    "slow"
  );
});

$(".sf-lineup").click(function() {
  $("html,body").animate(
    {
      scrollTop: $(".third").offset().top
    },
    "slow"
  );
});

$("#sf-map-title").click(function() {
  $("html,body").animate(
    {
      scrollTop: $(".fourth").offset().top
    },
    "slow"
  );
});
