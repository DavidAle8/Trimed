# import calendar
# from datetime import date
# from workalendar.america import Brazil

# horas = [7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18]

# cal = calendar.Calendar()
# br = Brazil()

# ano = 2025
# mes = 9

# dias_do_mes = []
# for dia in cal.itermonthdates(ano, mes):
#     if dia.month == mes:
#         disponivel = br.is_working_day(dia)

#         dias_do_mes.append({
#             "dia": dia.isoformat(),
#             "horas": [
#                 {"hora": h, "disponivel": disponivel} for h in horas
#             ]
#         })

# print(dias_do_mes)

# horas = [7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18]

# [
#     {
#         'dia': ...,
#         'horas': horas
#         'disponivel': true
#     },
#     {
#         'dia': ...,
#         'horas': horas
#         'disponivel': true
#     },
#     {
#         'dia': ...,
#         'horas': horas
#         'disponivel': true
#     },
#     {
#         'dia': ...,
#         'horas': horas
#         'disponivel': true
#     },
    
# ]

# [
#   {
#     "dia": "2025-09-01",
#     "horas": [
#       {"hora": 7, "disponivel": true},
#       {"hora": 8, "disponivel": true},
#       {"hora": 9, "disponivel": true},
#       ...
#     ]
#   },
#   {
#     "dia": "2025-09-02",
#     "horas": [
#       {"hora": 7, "disponivel": true},
#       {"hora": 8, "disponivel": true},
#       ...
#     ]
#   },
#   {
#     "dia": "2025-09-07",
#     "horas": [
#       {"hora": 7, "disponivel": false},   // domingo ou feriado
#       {"hora": 8, "disponivel": false},
#       ...
#     ]
#   }
# ]







# HORARIOS = [
#     (time(8, 0), "08:00"),
#     (time(9, 0), "09:00"),
#     (time(10, 0), "10:00"),
#     (time(11, 0), "11:00"),
#     (time(12, 0), "12:00"),
# ]

# class Agendamento(models.Model):
#     data = models.DateField()
#     hora = models.TimeField(choices=HORARIOS)


