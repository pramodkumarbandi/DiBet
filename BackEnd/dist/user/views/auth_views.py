import random
from datetime import timedelta
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User, OTP
from ..utils import validate_phone


# =========================
# SEND OTP
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    phone = request.data.get("phone")

    is_valid, msg = validate_phone(phone)
    if not is_valid:
        return Response({"error": msg}, status=400)

    otp = str(random.randint(100000, 999999))
    expiry = timezone.now() + timedelta(minutes=5)

    OTP.objects.filter(phone=phone).delete()
    OTP.objects.create(phone=phone, otp=otp, expires_at=expiry)

    print("OTP:", otp)
    return Response({"message": "OTP sent successfully"})


# =========================
# VERIFY OTP
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    phone = request.data.get("phone")
    otp = request.data.get("otp")

    is_valid, msg = validate_phone(phone)
    if not is_valid:
        return Response({"error": msg}, status=400)

    otp_obj = OTP.objects.filter(phone=phone).first()
    if not otp_obj:
        return Response({"error": "OTP not found"}, status=400)

    if otp_obj.is_expired():
        otp_obj.delete()
        return Response({"error": "OTP expired"}, status=400)

    if otp_obj.otp != otp:
        return Response({"error": "Invalid OTP"}, status=400)

    otp_obj.is_verified = True
    otp_obj.save()

    return Response({"message": "OTP verified successfully"})


# =========================
# REGISTER (SIGNUP)
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    phone = request.data.get("phone")
    username = request.data.get("username")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")
    campaign_code = request.data.get("campaign_code")

    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=400)

    is_valid, msg = validate_phone(phone)
    if not is_valid:
        return Response({"error": msg}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    otp_obj = OTP.objects.filter(phone=phone, is_verified=True).first()
    if not otp_obj:
        return Response({"error": "OTP not verified"}, status=400)

    user = User.objects.create(
        phone=phone,
        username=username,
        campaign_code=campaign_code
    )
    user.set_password(password)
    user.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Registration successful",
        "user_id": user.id,
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh)
    }, status=status.HTTP_201_CREATED)
