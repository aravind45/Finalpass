import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, AlertTriangle, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FollowUpRecommendation {
  assetId: string;
  institution: string;
  assetType: string;
  value: number;
  daysSinceContact: number;
  lastContactDate: Date | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action: string;
  message: string;
  dueDate: Date;
}

interface FollowUpWidgetProps {
  estateId: string;
}

const FollowUpWidget: React.FC<FollowUpWidgetProps> = ({ estateId }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<FollowUpRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowUps();
  }, [estateId]);

  const fetchFollowUps = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/follow-ups/estate/${estateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-amber-100 text-amber-800 border-amber-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-slate-100 text-slate-800 border-slate-200'
    };

    return (
      <Badge className={`${variants[priority]} border`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Follow-up Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Follow-up Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              All caught up! No follow-ups needed right now.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Follow-up Reminders
          </CardTitle>
          <Badge variant="destructive" className="text-sm">
            {recommendations.length} {recommendations.length === 1 ? 'action' : 'actions'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.slice(0, 5).map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => navigate(`/assets/${rec.assetId}`)}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getPriorityIcon(rec.priority)}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {rec.institution}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {rec.assetType} • ${rec.value.toLocaleString()}
                  </p>
                </div>
                {getPriorityBadge(rec.priority)}
              </div>

              <p className="text-sm text-foreground">
                {rec.message}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{rec.daysSinceContact} days since last contact</span>
              </div>
            </div>
          </div>
        ))}

        {recommendations.length > 5 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/follow-ups')}
          >
            View all {recommendations.length} reminders
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpWidget;
