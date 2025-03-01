'use client';

import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Card, Spin, Typography, Button, message, Empty } from 'antd'; 
import debounce from 'lodash/debounce';


const { Title,} = Typography;

function stripeHTMLTags(content: string) {
   return content.replace(/<\/?[^>]+(>|$)/g,"");

}


interface Post {
  id: number;
  title: string;
  content: string;
  upvotes?: number; 
  downvotes?: number;
}

const PaginatedPostsComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchMorePosts = async () => {
    if (!hasMore) return; 
    setIsFetching(true);
    try {
      const data = await api.fetchPaginatedPosts(page, 10);
      if (data.length === 0) setHasMore(false);
      setPosts((prevPosts) => [...prevPosts, ...data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Error fetching posts: ${error.message}`); 
      } else {
        message.error('Error fetching posts: Unknown error');
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMorePosts();
  }, []);

  const handleScroll = debounce(() => {
    if (
      isFetching || 
      !hasMore || 
      !containerRef.current ||
      (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 200)
    ) {
      return;
    }
    fetchMorePosts();
  }, 300); 

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]); 

  return (
    <div ref={containerRef} style={{ padding: '20px' }}>
      <Title level={4} className='font-semibold text-center mb-6'>Paginated Posts</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts.length === 0 && !isFetching ? (
          <Empty description="No posts available" />
        ) : (
          posts.map((post) => (
            <Card key={post.id} title={post.title} bordered={false}>
           <div>
                {stripeHTMLTags(post.content)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => message.info(`You clicked on ${post.title}`)}>
                  Read More
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      {isFetching && (
     <div
        style={{
          position: 'fixed', 
          top: '50%', 
          left: '55%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 1000,
        }}
      >
        <Spin size="default" /> 
      </div>
      )}
      {!hasMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography.Text>No more posts to load</Typography.Text>
        </div>
      )}
    </div>
  );
};

export default PaginatedPostsComponent;
