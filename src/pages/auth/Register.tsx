import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { authService, RegisterData } from '../../services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    role: 'TECHNICIEN',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Vérifier si l'utilisateur a le droit de créer des comptes
    if (!authService.canRegisterUsers()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      setSuccess('Compte créé avec succès');
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'TECHNICIEN',
      });
    } catch (err) {
      setError('Erreur lors de la création du compte');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Créer un compte
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            margin="normal"
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleTextChange}
          />

          <TextField
            fullWidth
            required
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleTextChange}
          />

          <TextField
            fullWidth
            required
            margin="normal"
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleTextChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Rôle</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleSelectChange}
              label="Rôle"
            >
              <MenuItem value="TECHNICIEN">Technicien</MenuItem>
              <MenuItem value="GESTIONNAIRE">Gestionnaire</MenuItem>
              {authService.hasRole('ADMIN') && (
                <MenuItem value="ADMIN">Administrateur</MenuItem>
              )}
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Créer le compte
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register; 