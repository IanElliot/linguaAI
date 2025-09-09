'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Review', path: '/review' },
  ];

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleClose();
    await signOut({ redirect: false });
    router.push('/signin');
  };

  const handleProfileNavigate = () => {
    handleClose();
    router.push('/profile');
  };

  // Get initials from user's name for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        backgroundColor: 'transparent',
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '64px',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left side - LinguaAI header with subtitle below */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          pt: 0.5,
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: 'orange',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              lineHeight: 1.2,
            }}
          >
            LinguaAI
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#666666',
              display: { xs: 'none', sm: 'block' },
              lineHeight: 1.2,
            }}
          >
            Your conversational language assistant
          </Typography>
        </Box>

        {/* Right side - Navigation and Profile */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              href={item.path}
              sx={{
                color: pathname === item.path ? 'primary.main' : 'text.secondary',
                fontWeight: pathname === item.path ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          
          <Avatar
            onClick={handleProfileClick}
            sx={{ 
              bgcolor: 'primary.main',
              cursor: 'pointer',
              width: 40,
              height: 40,
              '&:hover': {
                bgcolor: '#e67e00',
              },
            }}
          >
            {session?.user?.name ? getInitials(session.user.name) : 'U'}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileNavigate}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 