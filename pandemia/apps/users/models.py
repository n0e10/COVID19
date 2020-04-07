from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


# admin $Adm1n2020
# guest YMW5WJCA

# ================================

class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nro_dni = models.CharField(max_length=8, null=True, blank=True)
    nombres = models.CharField(max_length=50, blank=True)

    # META CLASS
    class Meta:
        verbose_name_plural = "perfiles"

    # SAVE METHOD
    def save(self, *args, **kwargs):
        if not self.nombres:
            self.nombres = "{} {}".format(
                self.user.last_name, self.user.first_name)
        super(Perfil, self).save(*args, **kwargs)

    # TO STRING METHOD
    def __str__(self):
        return "{}".format(self.user.username)


"""
Hooking the create_user_profile and save_user_profile methods to the User model, whenever a save event occurs.
This kind of signal is called post_save.
"""


@receiver(post_save, sender=User)
def create_user_perfil(sender, instance, created, **kwargs):
    if created:
        Perfil.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_perfil(sender, instance, **kwargs):
    instance.perfil.save()


class Rol(models.Model):
    """
        Define los roles del usuario que se pueden desempeñar
        tales como: Local, Provincial, Departamental, Central
    """
    descripcion = models.CharField(max_length=50)
    activo = models.BooleanField("Estado activo", default=True)

    class Meta:
        verbose_name_plural = "roles"

    def __str__(self):
        return "{}".format(self.descripcion)


class AmbitoPermiso(models.Model):
    """
        Ambito que el usuario tiene relacionado con el rol desempeñado
    """
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE,
                            related_name='ambitos')
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE,
                               related_name='perfiles')
    ubigeo = models.CharField('Ubigeo', max_length=50, blank=True, null=True)

    def __str__(self):
        return "{} {}".format(self.id, self.perfil)
