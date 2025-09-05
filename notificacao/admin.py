from django.contrib import admin
from .models import Email

@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ['assunto', 'tipo_email', 'enviado_em']
    search_fields = ['assunto', 'mensagem']
    list_filter = ['tipo_email', 'enviado_em']
    readonly_fields = ['assunto', 'mensagem', 'tipo_email', 'enviado_em']
