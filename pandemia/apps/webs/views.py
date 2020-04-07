from django.shortcuts import render
from django.contrib.auth.views import LoginView
from apps.users.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, FormView
# Create your views here.


class UserLoginView(LoginView):
    template_name = 'login.html'


class HomeView(TemplateView):
    template_name = "modules/home.html"
    # module = "home"

    # def get_context_data(self, **kwargs):
    #     context = super(HomeView, self).get_context_data(**kwargs)
    #     dashboard = {
    #         "summaries": []  # ToDo: Insertar sumary maximo 4 ver ejemplo
    #     }
    #
    #     context.update({"dashboard": dashboard})
    #     return context