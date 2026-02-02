from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")

        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(phone, password, **extra_fields)


class User(AbstractUser):
    email = None  # remove email
    phone = models.CharField(max_length=15, unique=True)

    #  THIS IS WHAT FRONTEND USES
    username = models.CharField(
        max_length=30,
        unique=True
    )

    campaign_code = models.CharField(max_length=50, blank=True, null=True)

    USERNAME_FIELD = "phone"          # login with phone
    REQUIRED_FIELDS = ["username"]    # username required on signup

    objects = UserManager()

    def __str__(self):
        return self.username


class OTP(models.Model):
    phone = models.CharField(max_length=15)
    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at
