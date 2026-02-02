from rest_framework import serializers
from ..models import User
from user.utils import validate_phone


class RegisterSerializer(serializers.ModelSerializer):
    # username comes from signup UI, but NOT a model field
    username = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'phone',
            'username',          
            'password',
            'confirm_password',
            'campaign_code'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'campaign_code': {'required': False},
            'phone': {'validators': []},
        }

    # -------------------------
    # PHONE VALIDATION
    # -------------------------
    def validate_phone(self, value):
        is_valid, message = validate_phone(value)
        if not is_valid:
            raise serializers.ValidationError(message)

        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already registered")

        return value

    # -------------------------
    # USERNAME (DISPLAY NAME) VALIDATION
    # -------------------------
    def validate_username(self, value):
        if len(value) < 4 or len(value) > 30:
            raise serializers.ValidationError(
                "Username must be 4–30 characters long"
            )

        if not value.replace("_", "").isalnum():
            raise serializers.ValidationError(
                "Username can contain only letters, numbers, and underscore"
            )

        # Check against display_name, NOT username
        if User.objects.filter(display_name=value).exists():
            raise serializers.ValidationError("Username already exists")

        return value

    # -------------------------
    # PASSWORD VALIDATION
    # -------------------------
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters"
            )

        if not any(char.isupper() for char in value):
            raise serializers.ValidationError(
                "Password must contain 1 uppercase letter"
            )

        if not any(char.islower() for char in value):
            raise serializers.ValidationError(
                "Password must contain 1 lowercase letter"
            )

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError(
                "Password must contain 1 number"
            )

        if not any(char in "!@#$%^&*(),.?\":{}|<>" for char in value):
            raise serializers.ValidationError(
                "Password must contain 1 special character"
            )

        return value

    # -------------------------
    # CONFIRM PASSWORD CHECK
    # -------------------------
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })
        return data

    # -------------------------
    # USER CREATION
    # -------------------------
    def create(self, validated_data):
        username = validated_data.pop('username')          #  username
        validated_data.pop('confirm_password', None)

        user = User.objects.create_user(
            phone=validated_data['phone'],
            password=validated_data['password'],
            campaign_code=validated_data.get('campaign_code'),
            display_name=username                           #map here
        )
        return user
