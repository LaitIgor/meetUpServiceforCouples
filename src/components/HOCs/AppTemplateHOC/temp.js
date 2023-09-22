// {/* <IconButton
// color="inherit"
// aria-label="open drawer"
// onClick={handleDrawerOpen}
// edge="start"
// sx={{
//   marginRight: 5,
//   ...(open && { display: 'none' }),
// }}
// >            <MenuIcon />
// </IconButton> */}
// <aside className={styles['sidebar']}>



// <Drawer 
// variant="permanent" 
// open={open}

// // onMouseEnter={handleDrawerOpen}
// // onMouseLeave={handleDrawerClose}
// >
// {/* <DrawerHeader >
// <IconButton
//   color="inherit"
//   aria-label="open drawer"
//   onClick={handleDrawerOpen}
//   edge="start"
//   sx={{
//     marginInline: 'auto',
//     ...(open && { display: 'none' }),
//   }}
// >            <MenuIcon />
// </IconButton>
// {open && <IconButton onClick={handleDrawerClose}>
//   {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
// </IconButton>}
// </DrawerHeader> */}
// <Divider />
// <List className={styles['sidebar-list']}>
// {Object.keys(sidebarElems).map((elem, index) => (
//   <ListItem key={elem} disablePadding sx={{ display: 'block' }} className={styles['sidebar-list__item']}>
//     {index === Object.keys(sidebarElems).length - 2 ? <Divider /> : null}
//     <ListItemButton
//       sx={{
//         minHeight: 48,
//         justifyContent: open ? 'initial' : 'center',
//       //   flexDirection: 'column',
//         px: 2.5,
//       }}
//     >
//       <ListItemIcon
//         sx={{
//             minWidth: 0,
//             // width: '75px !important',
//             mr: open ? 3 : 'auto',
//             dislplay: 'block',
//             justifyContent: 'center',
//             // display: 'block'
//           }}
//       >
//           <div className={styles['list-item__button']}>                
//             <svg>
//                 <use xlinkHref={sidebarElems[elem].icon}></use>
//             </svg>
//             <span className={styles['list-item__subtitle']}>{elem}</span>
//           </div>
//       </ListItemIcon>
//       <div style={{width: 0, display: 'flex', flexDirection: 'column'}}>
//         {sidebarElems[elem].openLinks.map((openLink) => {
//           return <NavLink 
//           key={openLink.openText}
//           to={openLink.path}  className={({isActive}) => isActive ? `${styles['navLink']} ${styles['activeLink']}` : styles['navLink']}
//           >
//             <ListItemText primary={openLink.openText} sx={{ opacity: open ? 1 : 0 }} />
//         </NavLink> 
//         })}
//       </div>
//     </ListItemButton>
    
//   </ListItem>
// ))}
// </List>
// </Drawer>
// </aside>
// <WrappedComponent />
// </div>