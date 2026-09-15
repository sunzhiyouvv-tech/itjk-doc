import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import {
  Drawer,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Typography
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { Mode } from 'components/App';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  mode: Mode;
  onChangeMode: () => void;
}

const languages = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' }
];

const Navbar: React.FC<NavbarProps> = ({ mode, onChangeMode }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage);
  };

  const languageSelector = (
    <FormControl size="small" sx={{ minWidth: 110 }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        displayEmpty
        sx={{
          color: 'inherit',
          '& .MuiSelect-icon': { color: 'inherit' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const modeButton = (
    <Icon
      onClick={onChangeMode}
      style={{ cursor: 'pointer' }}
      fontSize={30}
      icon={
        mode === 'dark'
          ? 'ic:round-dark-mode'
          : mode === 'light'
            ? 'ic:round-light-mode'
            : 'ic:round-contrast'
      }
    />
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        color: 'text.primary',
        pt: 2
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mx: { md: '50px', lg: '150px' }
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Stack direction="row" spacing={1.2} alignItems="baseline">
            <Typography
              component="span"
              sx={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, letterSpacing: '-0.03em' }}
            >
              ITJK
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: isMobile ? 14 : 17, fontWeight: 600, color: 'text.secondary' }}
            >
              文档工具箱
            </Typography>
          </Stack>
        </Link>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Stack spacing={3} alignItems="center" sx={{ p: 3, minWidth: 180 }}>
                {languageSelector}
                {modeButton}
              </Stack>
            </Drawer>
          </>
        ) : (
          <Stack direction="row" spacing={3} alignItems="center">
            {languageSelector}
            {modeButton}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
