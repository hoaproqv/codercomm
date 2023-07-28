import React, { useCallback, useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  MenuItem,
  Menu,
  Modal,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { useDispatch } from "react-redux";
import { deletePost, updatePost } from "./postSlice";
import useAuth from "../../hooks/useAuth";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { FTextField, FormProvider } from "../../components/form";
import FUploadPostImage from "../../components/form/FUploadPostImage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderColor: "transparent",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const styleDelete = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderColor: "transparent",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function PostCard({ post }) {
  const methods = useForm();
  const { handleSubmit, reset, setValue } = methods;

  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePostClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePostClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpenEditPost(false);
    setOpenDeletePost(false);
  };
  const handleConfirmDelete = () => {
    setOpenDeletePost(true);
    handlePostClose();
  };

  const handleDeletePost = () => {
    dispatch(deletePost({ postId: post._id }));
  };

  const [openEditPost, setOpenEditPost] = useState(false);
  const [openDeletePost, setOpenDeletePost] = useState(false);
  const handleEditPost = () => {
    setOpenEditPost(true);
    setValue("postId", post._id);
    setValue("content", post.content);
    setValue("image", post.image);
  };

  const [contentPost, setContentPost] = useState(post.content);
  const handleEditContentPost = (value) => {
    setContentPost(value);
    setValue("content", value);
  };

  const onSubmit = (data) => {
    setOpenEditPost(false);
    dispatch(updatePost(data)).then(() => reset());
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
      }
    },
    [setValue],
  );

  return (
    <>
      <Card>
        <CardHeader
          disableTypography
          avatar={
            <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
          }
          title={
            <Link
              variant="subtitle2"
              color="text.primary"
              component={RouterLink}
              sx={{ fontWeight: 600 }}
              to={`/user/${post.author._id}`}
            >
              {post?.author?.name}
            </Link>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {fDate(post.createdAt)}
            </Typography>
          }
          action={
            user._id === post.author._id && (
              <>
                <IconButton onClick={handlePostClick}>
                  <MoreVertIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Menu
                  id="post-menu"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handlePostClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleEditPost();
                      handlePostClose();
                    }}
                  >
                    Edit Post
                  </MenuItem>
                  <MenuItem onClick={handleConfirmDelete}>Delete Post</MenuItem>
                </Menu>
              </>
            )
          }
        />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography>{post.content}</Typography>

          {post.image && (
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                height: 300,
                "& img": { objectFit: "cover", width: 1, height: 1 },
              }}
            >
              <img src={post.image} alt="post" />
            </Box>
          )}

          <PostReaction post={post} />
          <CommentList postId={post._id} />
          <CommentForm postId={post._id} />
        </Stack>
      </Card>

      <Modal
        open={openEditPost}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack>
            <CardHeader
              disableTypography
              avatar={
                <Avatar
                  src={post?.author?.avatarUrl}
                  alt={post?.author?.name}
                />
              }
              title={
                <Link
                  variant="subtitle2"
                  color="text.primary"
                  component={RouterLink}
                  sx={{ fontWeight: 600 }}
                  to={`/user/${post.author._id}`}
                >
                  {post?.author?.name}
                </Link>
              }
              subheader={
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "text.secondary" }}
                >
                  {fDate(post.createdAt)}
                </Typography>
              }
            />
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} sx={{ p: 3 }}>
                <FTextField
                  name="content"
                  multiline
                  fullWidth
                  rows={4}
                  value={contentPost}
                  onChange={(event) =>
                    handleEditContentPost(event.target.value)
                  }
                />

                <FUploadPostImage
                  name="image"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton size="small" type="submit" variant="contained">
                  Post
                </LoadingButton>
              </Box>
            </FormProvider>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openDeletePost}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack spacing={3} sx={styleDelete}>
          <Typography display="inline-block">
            Do you want delete this post?
          </Typography>
          <Button variant="contained" color="error" onClick={handleDeletePost}>
            Delete Post
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default PostCard;
