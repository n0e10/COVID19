from django.db import models
# from django.contrib.auth.models import AbstractUser
# from django.utils.translation import ugettext_lazy as _

# admin $Adm1n2020
# guest YMW5WJCA

# Create your models here.


class Permisos(models.Model):
    permiso = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=50)
    # activo = models.IntegerField()


class Roles(models.Model):
    rol = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=50)
    # activo = models.IntegerField()
    STATUS = (
        ('Local', 'Local'),
        ('Provincial', 'Provincial'),
        ('Departamental', 'Departamental'),
        ('Gobierno Central', 'Gobierno Central'),
    )
    nombre = models.CharField(max_length=200, null=True, choices=STATUS)


class RolPermiso(models.Model):
    rol_id = models.ForeignKey(
        Roles,
        on_delete=models.CASCADE,
    )  # type: Permisos
    permiso_id = models.ForeignKey(
        Permisos,
        on_delete=models.CASCADE,
    )


class Usuarios(models.Model):
    nombres = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    user_name = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    fecha_registro = models.DateTimeField(auto_now_add=True, null=True)
    activo = models.IntegerField()

    rol_id = models.ForeignKey(
        Roles,
        on_delete=models.CASCADE,
    )


class Ambito(models.Model):
    ubigeo = models.CharField(max_length=10)
    fecha_registro = models.DateTimeField(auto_now_add=True, null=True)

    usuario_id = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
    )
