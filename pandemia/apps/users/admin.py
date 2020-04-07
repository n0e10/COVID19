from django.utils.safestring import mark_safe
from django.urls import reverse
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from apps.users.models import Perfil, Rol, AmbitoPermiso


class PerfilInline(admin.StackedInline):
    model = Perfil
    can_delete = False
    verbose_name_plural = 'Perfil'
    fk_name = 'user'


class CustomUserAdmin(UserAdmin):
    inlines = (PerfilInline, )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff',
                    'get_numero_documento', 'get_nombres')
    list_select_related = ('perfil', )

    def get_numero_documento(self, instance):
        return instance.perfil.nro_dni
    get_numero_documento.short_description = 'nro_dni'

    def get_nombres(self, instance):
        return instance.perfil.nombres
    get_nombres.short_description = 'Nombres'

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)


class RolAdmin(admin.ModelAdmin):
    list_display = ('id', 'descripcion', 'activo')
    search_fields = ('id', 'descripcion')
    list_filter = ('activo',)


class AmbitoPermisoAdmin(admin.ModelAdmin):
    list_display = ('id', 'rol', 'perfil', 'perfil_link', 'ubigeo', 'get_estado_perfil')
    search_fields = ('id', 'ubigeo', 'perfil')
    list_filter = ('perfil__user__is_active', 'rol')

    def get_estado_perfil(self, obj):
        if obj.perfil:
            return obj.perfil.user.is_active
        return ""
    
    def perfil_link(self, obj):
        if obj.perfil:
            url = reverse("admin:auth_user_change", args=[obj.perfil.user.id])
            link = '<a href="%s" target="_blank">%s</a>' % (url, obj.perfil.user.username)
            return mark_safe(link)
        return ''

    get_estado_perfil.short_description = 'Activo'
    get_estado_perfil.boolean = True
    perfil_link.short_description = 'Perfil'


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Rol, RolAdmin)
admin.site.register(AmbitoPermiso, AmbitoPermisoAdmin)
