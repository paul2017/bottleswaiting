angular.module("bwcapp.oauth", [])
.config(function() {
  })
  .run(function(Restangular, oauthErrorInterceptor) {
     Restangular.setErrorInterceptor(oauthErrorInterceptor);
  });