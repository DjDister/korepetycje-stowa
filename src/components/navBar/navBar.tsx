import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../redux/loginSlice";
import { clearProfile } from "../../redux/profileSlice";
import styles from "./navbar.module.css";
function Navbar() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);
  const { isLoggedIn } = useAppSelector((state) => state.loginStatus);
  const pages =
    profile.type === "teacher"
      ? ["My students", "Messages"]
      : isLoggedIn
      ? ["Find a teacher", "Messages", "Your's teachers"]
      : ["Find a teacher", "Become a teacher"];
  const settings =
    profile.type === "teacher"
      ? ["Home", "Settings", "Logout"]
      : ["Home", "Saved teachers", "Settings", "Logout"];
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onMenuItemClick = (setting: string) => {
    handleCloseNavMenu();
    switch (setting) {
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/messages");
        break;
      case "My students":
        navigate("/my-students");
        break;
      case "Find a teacher":
        navigate("/find-a-teacher");
        break;
      case "Become a teacher":
        navigate("/become-a-teacher");
        break;
      case "Your's teachers":
        navigate("/teachers");
        break;
      case "Settings":
        navigate("/settings");
        break;
      case "Logout":
        navigate("/");
        dispatch(logOut());
        dispatch(clearProfile());
        break;
      default:
        break;
    }
  };

  return (
    <AppBar color="secondary" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            className={`${styles.logoImage} ${styles.desktop}`}
            alt="logo"
            src={`https://media.discordapp.net/attachments/1046328170497982517/1064111326592507924/Krystian2__bark_beetle_as_a_superhero_logo_22903d65-7600-4d43-8cd8-5205adeabbe6.png?width=657&height=657`}
          />

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            STOWA
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => onMenuItemClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <img
            className={`${styles.logoImage} ${styles.mobile}`}
            alt="logo"
            src={`https://media.discordapp.net/attachments/1046328170497982517/1064111326592507924/Krystian2__bark_beetle_as_a_superhero_logo_22903d65-7600-4d43-8cd8-5205adeabbe6.png?width=657&height=657`}
          />

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            STOWA
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => onMenuItemClick(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {isLoggedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => onMenuItemClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button onClick={() => navigate("/login")}>
              <Typography textAlign="center">Login</Typography>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
