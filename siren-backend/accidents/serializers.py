from rest_framework import serializers
from .models import Accident

class AccidentSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Accident
        fields = '__all__'  # Or list explicitly

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None









# # accidents/serializers.py

# from rest_framework import serializers
# from .models import Accident

# class AccidentSerializer(serializers.ModelSerializer):
#     image = serializers.ImageField(use_url=True)

#     class Meta:
#         model = Accident
#         fields = '__all__'

