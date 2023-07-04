import { styled } from 'styled-components'
import 
{
  SearchRounded, 
  LightMode,
  TrendingUp,
  AccessTime
} from '@mui/icons-material';
import { Tab, Tabs, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from './Modal/LoginModal';

const StyledTabs = styled(Tabs)(
  {
    "& .MuiTabs-indicator": {
      backgroundColor: "#000"
    },
    "& .MuiTab-textColorPrimary": {
      color: "lightgray",
      fontWeight: 300
    },
    "& .MuiTab-textColorPrimary.Mui-selected": {
      color: "#000"
    }
  }
)

const Nav = () => {
  const [headMargin, setHeadMargin] = useState<number>(0);
  const [prevScrollY, setPrevScrollY] = useState<number>(0);
  const [modalopen, setModalopen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > prevScrollY) {
      setHeadMargin(-72);
    } else {
      setHeadMargin(0);
    }
    setPrevScrollY(currentScrollY);
  }, [prevScrollY]);

  useEffect(() => {
    setPrevScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleClick = () => {
    navigate('/search');
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPage(newValue);
    if (newValue === 0) {
      navigate('/');
    } else if(newValue === 1) {
      navigate('/recent');
    }
  }
  
  return (
    <>
    
      <Container headMargin={headMargin}>
        <Wrapper>
          <Typography 
            sx={{cursor: "pointer"}} 
            variant='h5'
            onClick={() => navigate('/')}
          >
          Fukufuku
          </Typography>

          <Item>
            <Icon>
              <LightMode />
            </Icon>
            <Icon onClick={handleClick}>
              <SearchRounded />
            </Icon>

            <Login onClick={() => {setModalopen(true)}}>
              <Typography sx={{color: 'white'}}>로그인</Typography>
            </Login>
          </Item>

        </Wrapper>

        {
          (pathname === '/' || pathname === '/recent') && (
            <CategoryWrapper>
              <StyledTabs 
              value={page} 
              onChange={handleChange}>
                <Tab
                  label={
                    <Category>
                      <TrendingUp fontSize="medium" sx={{ mr: '5px' }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          cursor: 'pointer', 
                          ...page === 0 && { fontWeight: 700 }, ...page !== 0 && { fontWeight: 300 }
                        }}
                      >
                        트렌딩
                      </Typography>
                    </Category>
                  }
                />
                <Tab
                  label={
                    <Category>
                      <AccessTime fontSize="medium" sx={{ mr: '5px' }} />
                      <Typography variant="h6" sx={{ cursor: 'pointer', ...page === 1 && { fontWeight: 700 }, ...page !== 1 && { fontWeight: 300 }}}>
                        최신
                      </Typography>
                    </Category>
                  }
                />
              </StyledTabs>
            </CategoryWrapper>
          )
        }

      </Container>

      {
        modalopen && (
          <LoginModal setModalopen={setModalopen} />
        )
      }

    </>
  )
}

export default Nav

const Category = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 90px;
  height: 20px;
`

const Container = styled.div<{headMargin: number}>`
  position: fixed;
  width: 100%;
  height: 72px;
  background-color: #fff;
  margin-top: ${props => props.headMargin}px;
  transition: all 0.3s ease-in-out;
`

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  width: 1728px;

  @media (max-width: 1328px) {
    width: 1000px;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  width: 1728px;

  @media (max-width: 1328px) {
    width: 1000px;
  }
`

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Login = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  background-color: #000;
  cursor: pointer;
  margin-left: 10px;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  cursor: pointer;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #c2c2c2;
    border-radius: 50%;
  }
`