from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..models import User
from user.utils import validate_phone


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    login_type = request.data.get("login_type", "normal")
    identifier = request.data.get("identifier")
    password = request.data.get("password")

    # =========================
    # DEMO LOGIN (NO TOKEN)
    # =========================
    if login_type == "demo":
        demo_user = User.objects.filter(username="demo_user").first()
        if not demo_user:
            return Response({"error": "Demo user not configured"}, status=400)

        return Response({
            "message": "Demo login successful",
            "user_type": "demo",
            "user_id": demo_user.id
        }, status=200)

    # =========================
    # NORMAL LOGIN
    # =========================
    if not identifier or not password:
        return Response(
            {"error": "Username/Phone and password are required"},
            status=400
        )

    # If identifier is phone → validate
    if identifier.isdigit():
        is_valid, msg = validate_phone(identifier)
        if not is_valid:
            return Response({"error": msg}, status=400)

    user = (
        User.objects.filter(phone=identifier).first()
        or User.objects.filter(username=identifier).first()
    )

    if not user:
        return Response({"error": "User not found"}, status=400)

    if not user.check_password(password):
        return Response({"error": "Invalid password"}, status=400)

    return Response({
        "message": "Login successful",
        "user_id": user.id
    }, status=200)
