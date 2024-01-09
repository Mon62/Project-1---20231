import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Button, Container, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
function Sidebar2() {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: "250px",
          backgroundColor: "#fafafa",
          p: "20px 0px",
        },
      }}
    >
      <List sx={{ justifyContent: "space-around", textAlign: "center" }}>
        <Typography variant="h2" sx={{ fontWeight: "400" }}>
          Phần mềm
        </Typography>
        <Typography variant="h3">Quản lý chung cư</Typography>
        {/* <ListItem component="a" href="/danhsachthuphi">
          <ListItemIcon></ListItemIcon>
          <ListItemText
            primary="Thu Phí"
            primaryTypographyProps={{ style: { fontSize: "20px" } }}
          ></ListItemText>
          <ListItemIcon>
            <FontAwesomeIcon icon={faChevronDown} />
          </ListItemIcon>
        </ListItem> */}
      </List>
    </Drawer>
  );
}

export default Sidebar2;
