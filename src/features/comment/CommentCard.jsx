import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import { MoreVert } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { FormProvider } from "../../components/form";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { deleteComment, updateComment } from "./commentSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
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

function CommentCard({ comment }) {
  const commentUserId = comment.author._id;
  const { user } = useAuth();
  const dispatch = useDispatch();

  const methods = useForm();
  const { handleSubmit, reset, setValue } = methods;

  const [anchorEl, setAnchorEl] = useState(null);
  const [commentContent, setCommentContent] = useState(comment.content);

  const [openEditComment, setOpenEditComment] = useState(false);
  const [openDeleteComment, setOpenDeleteComment] = useState(false);
  const handleOpenEditComment = () => {
    setOpenEditComment(true);
    setValue("content", comment.content);
    setValue("commentId", comment._id);
    setValue("postId", comment.post);
  };
  const handleOpenDeleteComment = () => setOpenDeleteComment(true);
  const handleClose = () => {
    setOpenDeleteComment(false);
    setOpenEditComment(false);
  };

  const handleCommentClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCommentClose = () => {
    setAnchorEl(null);
  };
  const handleEditComment = (value) => {
    setCommentContent(value);
    setValue("content", value);
  };

  const handleConfirmDelete = () => {
    handleCommentClose();
    handleOpenDeleteComment();
  };

  const handleDeleteComment = () => {
    dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));
    handleClose();
  };

  const onSubmit = (data) => {
    dispatch(updateComment(data)).then(() => reset());
    handleClose();
  };
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
        <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
          <Stack
            direction="row"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {comment.author?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {fDate(comment.createdAt)}
              </Typography>
            </Stack>
            {user._id === commentUserId && (
              <>
                <IconButton onClick={handleCommentClick}>
                  <MoreVert />
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
                  onClose={handleCommentClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleOpenEditComment();
                      handleCommentClose();
                    }}
                  >
                    Edit Comment
                  </MenuItem>
                  <MenuItem onClick={handleConfirmDelete}>
                    Delete Comment
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <CommentReaction comment={comment} />
          </Box>
        </Paper>
      </Stack>
      <Modal
        open={openEditComment}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb="20px"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={comment?.author?.avatarUrl}
                alt={comment?.author?.name}
              />
              <Typography>{comment?.author?.name}</Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {fDate(comment.updatedAt)}
            </Typography>
          </Stack>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              multiline
              fullWidth
              rows={4}
              value={commentContent}
              onChange={(event) => handleEditComment(event.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mt: "20px",
              }}
            >
              <Button size="small" type="submit" variant="contained">
                Comment
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Modal>

      <Modal
        open={openDeleteComment}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack spacing={3} sx={styleDelete}>
          <Typography display="inline-block">
            Do you want delete this comment?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteComment}
          >
            Delete Comment
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default CommentCard;
