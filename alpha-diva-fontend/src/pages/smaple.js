<Grid container className={classes.contentHeader}>
               {Tabs.map((tab,index)=>
                <Grid key={index} onClick={()=>{
                  if(currentTab != index){
                    setcurrentTab(index);
                    setStartSearch(0);
                    set_type(tab);
                    fetchShops(lat,lng,tab,0);
                  }
                  
                }} key={index} style={{backgroundColor:currentTab == index ? "rgba(255,0,0,0.1)" : "white"}} className={classes.contentMenus} item xs={4}>
                  {tab}
                </Grid>
               )}
             </Grid>

             {shops.length < 1 && !loading ? 
                <div style={{width:200,margin:'auto',marginTop:50}}>
                    <center><p style={{fontSize:14}}>Sorry, we couldn't find any results in <span style={{color:"red"}}>{userCurrentAddress}</span></p>
                    <Button style={{backgroundColor:"black",color:"white",fontSize:10,borderRadius:0}}>Retry search</Button>
                    </center>
                </div>
             : null}
             {loading ? <div style={{padding:10}}>

                <ContentLoader viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>
                <ContentLoader style={{marginTop:10}} viewBox="0 0 380 70">
                    {/* Only SVG shapes */}    
                    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
                    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                </ContentLoader>

             </div> : null}
             {!loading  ? 
             <Box className={classes.contentBody} onScroll={scrolling}   ref={myRef}>
             {/* Contents come here */}
             {shops.map((shop,index)=>
               <ShopBox shop={shop} index={index}/>
             )}
           </Box> : null}