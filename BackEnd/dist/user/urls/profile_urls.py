from django.urls import path
from user.views.profile_views import *

urlpatterns = [
    path("dashboard/", profile_dashboard),

    path("deposit/", deposit),
    path("withdraw/", withdraw),

    path("statements/", statements_menu),

    path("transactions/", transactions),
    path("open-bets/", open_bets),
    path("betting-pl/", betting_profit_loss),
    path("account-statement/", account_statement),
    path("affiliate/", affiliate_program),
    path("bonus-statement/", bonus_statement),
    path("deposit-turnover/", deposit_turnover),
    path("turnover-history/", turnover_history),
]
