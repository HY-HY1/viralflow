from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from services.store import store

stats_routes = Blueprint('stats_routes', __name__)

@stats_routes.route('/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'total_downloads': len(store.downloads),
        'total_transcriptions': len(store.transcriptions),
        'storage_used': store.get_storage_used(),
        'recent_downloads': store.downloads[-5:] if store.downloads else []
    })

@stats_routes.route('/activity', methods=['GET'])
def get_activity():
    return jsonify({
        'activities': store.get_recent_activities(10)
    })

@stats_routes.route('/notifications', methods=['GET'])
def get_notifications():
    return jsonify({
        'notifications': store.get_notifications(10)
    }) 