from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


# =========================
# PROFILE DASHBOARD
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_dashboard(request):
    user = request.user
    return Response({
        "balance": getattr(user, "wallet_balance", 0),
        "bonus": getattr(user, "bonus_balance", 0),
        "net_exposure": 0
    })


# =========================
# ACTIONS
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get("amount")
    if not amount:
        return Response({"error": "Amount is required"}, status=400)

    return Response({
        "message": "Deposit initiated",
        "amount": amount,
        "status": "PENDING"
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw(request):
    amount = request.data.get("amount")
    if not amount:
        return Response({"error": "Amount is required"}, status=400)

    return Response({
        "message": "Withdraw request submitted",
        "amount": amount,
        "status": "PROCESSING"
    })


# =========================
# STATEMENTS MENU
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statements_menu(request):
    return Response({
        "title": "Statements",
        "items": [
            {"key": "transactions", "label": "Transaction"},
            {"key": "open_bets", "label": "Open Bets"},
            {"key": "betting_pl", "label": "Betting Profit & Loss"},
            {"key": "account_statement", "label": "Account Statement"},
            {"key": "affiliate", "label": "Affiliate Program"},
            {"key": "bonus_statement", "label": "Bonus Statement"},
            {"key": "deposit_turnover", "label": "Deposit Turnover"},
            {"key": "turnover_history", "label": "Turnover History"}
        ]
    })


# =========================
# STATEMENT DETAIL APIS
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transactions(request):
    return Response([])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def open_bets(request):
    return Response({"running_bets": []})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def betting_profit_loss(request):
    return Response({"profit": 0, "loss": 0})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account_statement(request):
    return Response([])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def affiliate_program(request):
    return Response({"referral_code": "REF12345"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bonus_statement(request):
    return Response([])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def deposit_turnover(request):
    return Response({"total": 0})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def turnover_history(request):
    return Response([])
