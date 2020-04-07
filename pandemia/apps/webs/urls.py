from django.urls import path
from django.contrib.auth.views import LogoutView
from apps.webs.views import UserLoginView, HomeView

app_name = "webs"

urlpatterns = [
    path('', HomeView.as_view()),
    path('login/', UserLoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
]
