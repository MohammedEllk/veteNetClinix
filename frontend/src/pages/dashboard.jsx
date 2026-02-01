import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../layout/mainLayout";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Skeleton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Person as PersonIcon,
  EventNote as ConsultationIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { listOwners } from '../api/owners.api';
import { listAnimals } from '../api/animals.api';
import { listConsultations } from '../api/consultations.api';

// Composant StatCard
function StatCard({ title, value, subtitle, icon: Icon, color, trend, loading }) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={80} height={48} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 700, color, mb: 1 }}>
                {value}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              width: 56,
              height: 56,
            }}
          >
            <Icon sx={{ fontSize: 32, color }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// Composant RecentActivity
function RecentActivity({ consultations, loading }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon color="primary" />
          Consultations récentes
        </Typography>
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
          </>
        ) : consultations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Aucune consultation récente
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {consultations.slice(0, 5).map((consultation) => (
              <Paper
                key={consultation.id}
                sx={{
                  p: 2,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <PetsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {consultation.animal?.nom || 'Animal inconnu'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {consultation.animal?.proprietaire?.nom || 'Propriétaire inconnu'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={consultation.motif || 'Consultation'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    {new Date(consultation.date_consultation).toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    owners: 0,
    animals: 0,
    consultations: 0,
    todayConsultations: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [ownersRes, animalsRes, consultationsRes] = await Promise.all([
        listOwners(),
        listAnimals(),
        listConsultations(),
      ]);

      const today = new Date().toDateString();
      const todayCount = consultationsRes.data.filter(
        (c) => new Date(c.date_consultation).toDateString() === today
      ).length;

      setStats({
        owners: ownersRes.total || ownersRes.data.length,
        animals: animalsRes.data.length,
        consultations: consultationsRes.data.length,
        todayConsultations: todayCount,
      });

      setRecentConsultations(consultationsRes.data || []);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenue, Dr {user?.name || 'Utilisateur'} 👋
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Propriétaires"
              value={stats.owners}
              subtitle="Propriétaires enregistrés"
              icon={PersonIcon}
              color="#1976d2"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Animaux"
              value={stats.animals}
              subtitle="Dossiers actifs"
              icon={PetsIcon}
              color="#2e7d32"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Consultations du jour"
              value={stats.todayConsultations}
              subtitle="Rendez-vous aujourd'hui"
              icon={CalendarIcon}
              color="#ed6c02"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Consultations"
              value={stats.consultations}
              subtitle="Consultations enregistrées"
              icon={ConsultationIcon}
              color="#9c27b0"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <RecentActivity consultations={recentConsultations} loading={loading} />
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Statistiques rapides
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Taux d'occupation
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stats.todayConsultations > 0 ? '75%' : '0%'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.todayConsultations > 0 ? 75 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Animaux suivis
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {((stats.animals / Math.max(stats.owners, 1)) * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.animals / Math.max(stats.owners, 1)) * 100}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      💡 Conseil du jour
                    </Typography>
                    <Typography variant="caption">
                      N'oubliez pas de mettre à jour les dossiers médicaux après chaque consultation.
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
