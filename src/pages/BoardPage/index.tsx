import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import {
  Favorite
}from '@mui/icons-material';
import { Link } from 'react-scroll';
import { Button, Skeleton } from '@mui/material';
import Comment from '../../components/Comment/Comment';
import styles from './board.module.scss';
import { store } from '../../store';

interface Board {
  id: number;
  title: string;
  content: string;
  like: number;
  u_id: number;
}

interface Author {
  email: string;
  picture: string;
}

const PostPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState<Board | null>(null)
  const [fixed, setFixed] = useState<boolean>(false)
  const [headerArray, setHeaderArray] = useState<string[]>([])
  const [commentValue, setCommentValue] = useState<string>('')
  const [author, setAuthor] = useState<Author>({} as Author)

  const navigate = useNavigate();

  const user = store.getState().user;
  console.log(board);
  
  // 게시글 가져오기
  useEffect(() => {
    async function getBoard() {
      await axios.get(`boards/${boardId}`).then((response) => {
        setBoard(response.data);
        getAuthor(response.data.u_id);
        idTag();
      }).catch((error) => {
        console.log(error);
        navigate('/error');
      });
    }
    getBoard();
  }, []);  

  // 작성자 정보 가져오기
  const getAuthor = async (u_id: number) => {
    const { data } = await axios.get(`user/${u_id}`);
    setAuthor({ email: data.email, picture: data.picture })
  }

  // 스크롤 위치를 확인하고 옆에 사이드에 있는 목차, 좋아요 버튼을 fixed 로 바꿔주는 함수
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setFixed(true)  
      } else {
        setFixed(false)
      }
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 글 내용에서 h1~h6 태그를 찾아서 id를 부여해주고 그 id를 배열에 담아줌
  const idTag = () => {
    if(!document) return;

    const content = document.getElementById('content');
    const header = content?.querySelectorAll('h1, h2, h3, h4, h5, h6');

    header?.forEach((el) => {
      el.setAttribute('id', el.textContent || '');
    });
    
    const headerIds = Array.from(header || []).map((el) => el.textContent || '');
    setHeaderArray(headerIds);

  };

  // 댓글 작성
  const handleComment = async () => {
    if (!user.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`;

    const data = {
      content: commentValue,
      boardId: Number(boardId),
      commenter: name,
      img: user.picture,
      u_id: user.id,
    };

    try {
      await axios.post('/comments', data);
      setCommentValue('');
      getComment();
    } catch (error) {
      console.log(error);
    }
  };

  // board 가 빈 객체이면 로딩중을 띄워주고, 아니면 게시글을 보여줌
  if (!board) {
    return (
      <Container>
        <Wrapper>
          <HeadWrapper style={{display: 'flex'}}>
            <Skeleton sx={{ mr: 1 }} variant='text' width='30%' height='80px' />
            <Skeleton sx={{ mr: 1 }} variant='text' width='20%' height='80px' />
            <Skeleton sx={{ mr: 1 }} variant='text' width='20%' height='80px' />
          </HeadWrapper>

          <InfoWrapper style={{display: 'flex'}}>
            <Skeleton sx={{mr: 1}} variant='text' width='10%' height='30px' />
            <Skeleton variant='text' width='10%' height='30px' />
          </InfoWrapper>

          <TagWrapper style={{display: 'flex', marginTop: '1rem'}}>
            <Skeleton sx={{mr: 1, ml: 1}} variant='rounded' width='10%' height='40px' />
            <Skeleton variant='rounded' width='10%' height='40px' />
          </TagWrapper>
          
          <BodyWrapper style={{ marginTop: 0}}>
            <Skeleton sx={{position: 'relative', top: -220}} variant='text' width='100%' height={1300} />
          </BodyWrapper>

        </Wrapper>
      </Container>
      )
  } else {
    return (
      <Container>
        <Wrapper>
  
          <HeadWrapper>
            <Title>{board.title}</Title>
  
            <SideContainer>
              <SideWrapper>
                <SideTool fixed={fixed ? 'true' : 'false'}>
                  <Favorite
                    color='disabled'
                    sx={{ mb: 1, backgroundColor: 'white',
                          border: '1px solid lightgrey', borderRadius: '50%', padding: '8px', cursor: 'pointer', 
                          '&:hover': { color: 'black', border: '1px solid black' 
                        }}}
                  />
                  {board.like}
                </SideTool>
              </SideWrapper>
            </SideContainer>
  
            <SideContainer>
              <SideNavWrapper>
                <SideNav fixed={fixed ? 'true' : 'false'}>
                {
                  headerArray.map((item, index) => (
                    <SideNavTitle key={index}>
                      <Link 
                        activeClass='active'
                        to={item}
                        spy={true}
                        smooth={true}
                        offset={-100}
                        duration={500}
                      >
                        {item}
                      </Link>
                    </SideNavTitle>
                  ))
                }
                </SideNav>
              </SideNavWrapper>
            </SideContainer>
  
          </HeadWrapper>
          
          <BodyWrapper>
            <Content id='content' dangerouslySetInnerHTML={{__html: board.content}} />
          </BodyWrapper>
  
          <ProfileWrapper>
            <div className={styles.main__profile}>
              <a href='#'>
                <img src={author.picture} alt='profile' />
              </a>
  
              <div className={styles.profile__info}>
                <a href='#'>{author.email}</a>
                <span>한줄소개 적는 부분</span>
              </div>
            </div>
          </ProfileWrapper>
  
          <FooterWrapper>
            <FooterHead>
              <h4>0개의 댓글</h4>
            </FooterHead>
            
            <FooterInput>            
              <textarea 
                className={styles.inputComment} 
                placeholder='댓글을 입력하세요'
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <ButtonWrapper>
                <Button 
                  variant='contained' 
                  color='primary'
                  onClick={handleComment}
                >댓글 작성</Button>
              </ButtonWrapper>
            </FooterInput>
  
            <FooterBody>
              {
                <Comment />
              }
            </FooterBody>
            
          </FooterWrapper>
  
        </Wrapper>
      </Container>
    )
  }
  
}

const Container = styled.div`
  width: 100%;
  top: 150px;
  position: relative;
  height: 1000vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 768px;

  @media screen and (max-width: 1023px) {
    width: 900px;
  }

  @media screen and (max-width: 767px) {
    width: 400px;
  }
`

const InfoWrapper = styled.div`
  width: 100%;
`

const TagWrapper = styled.div`
  width: 100%;
`

const ProfileWrapper = styled.div`
  width: 100%;
  margin-top: 10rem;
  margin-bottom: 10rem;
`

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: 1.5rem;
`

const FooterHead = styled.div`
  padding: 0.4rem;
  line-height: 1.5;
  font-weight: 600;
`

const FooterInput = styled.div``

const FooterBody = styled.div`
  margin-top: 1rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const HeadWrapper = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 1.rem;
`

const SideContainer = styled.div`
  position: relative;
`

const SideWrapper = styled.div`
  position: absolute;
  left: -150px;
`

const SideNavWrapper = styled.div`
  position: absolute;
  left: 100%;
`
const SideNav = styled.div <{fixed: string}>`
  position: ${props => (props.fixed === 'true' ? 'fixed' : 'relative')};
  top: 122px;
  width: 240px;
  max-height: calc(100vh - 128px);
  border-left: 2px solid #f1f3f5;
  color: #868e96;
  font-size: 1rem;
  line-height: 1.5;
  overflow: hidden auto;
  margin-left: 5rem;
  padding-left: 1rem;
`

const SideNavTitle = styled.div`
  display: block;
  margin-left: 0;
  margin-top: 4px;
  cursor: pointer;
  transition: all 0.125s ease-in 0s;

  a.active {
    transform: scale(1.1);
    color: #212529;
  }

  &:hover {
    color: #212529;
  }
`

const SideTool = styled.div <{fixed: string}>`
  position: ${props => (props.fixed === 'true' ? 'fixed' : 'absolute')};
  background-color: #f8f9fa;
  top: 122px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 3rem;
  border: 1px solid #e9ecef;
  border-radius: 2rem;
  padding: 1rem 0;
`

const Title = styled.div`
  font-size: 60px;
  font-weight: 600;
  margin-bottom: 20px;
`

const BodyWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`

const Content = styled.div`
  font-size: 20px;
`

export default PostPage