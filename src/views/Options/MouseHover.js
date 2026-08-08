import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useI18n } from "../../hooks/I18n";
import ShortcutInput from "./ShortcutInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import { useMouseHoverSetting } from "../../hooks/MouseHover";
import { useCallback } from "react";
import Grid from "@mui/material/Grid";
import {
  DEFAULT_MOUSEHOVER_KEY,
  DEFAULT_MOUSE_HOVER_BUBBLE_STYLE,
  OPT_MOUSE_HOVER_DISPLAY_BILINGUAL,
  OPT_MOUSE_HOVER_DISPLAY_BUBBLE,
  OPT_MOUSE_HOVER_TRANS_DISPLAY_BLOCK,
  OPT_MOUSE_HOVER_TRANS_DISPLAY_INLINE,
  OPT_MOUSE_HOVER_TRANS_AREA,
  OPT_MOUSE_HOVER_TRANS_PARAGRAPH,
} from "../../config";

/**
 * 鼠标悬停翻译 (MouseHover) 设置面板组件
 */
export default function MouseHoverSetting() {
  const i18n = useI18n();
  // 全局鼠标悬浮翻译配置 Hook
  const { mouseHoverSetting, updateMouseHoverSetting } = useMouseHoverSetting();

  // 首选触发快捷键变化时的处理回调
  const handleShortcutInput = useCallback(
    (val) => {
      updateMouseHoverSetting({ mouseHoverKey: val });
    },
    [updateMouseHoverSetting]
  );

  // 备选触发快捷键变化时的处理回调
  const handleAltShortcutInput = useCallback(
    (val) => {
      updateMouseHoverSetting({ mouseHoverKey2: val });
    },
    [updateMouseHoverSetting]
  );

  // 首选触发方式切换为“按住鼠标左键”
  const handleHoldKeyChange = useCallback(
    (checked) => {
      updateMouseHoverSetting({ mouseHoverKeyHold: checked });
    },
    [updateMouseHoverSetting]
  );

  // 备选触发方式切换为“按住鼠标左键”
  const handleAltHoldKeyChange = useCallback(
    (checked) => {
      updateMouseHoverSetting({ mouseHoverKey2Hold: checked });
    },
    [updateMouseHoverSetting]
  );

  // 按住左键触发的等待时长 (毫秒)
  const handleHoldDelayChange = useCallback(
    (e) => {
      const value = Number(e.target.value);
      updateMouseHoverSetting({
        mouseHoverHoldDelay:
          Number.isFinite(value) && value >= 0 ? value : 0,
      });
    },
    [updateMouseHoverSetting]
  );

  // 按住左键触发的翻译范围：只翻译当前段 / 翻译整个区域
  const handleTransModeChange = useCallback(
    (e) => {
      updateMouseHoverSetting({ mouseHoverTransMode: e.target.value });
    },
    [updateMouseHoverSetting]
  );

  // 按住左键译文的显示方式：跟随原文行内 / 独立成块
  const handleTransDisplayChange = useCallback(
    (e) => {
      updateMouseHoverSetting({ mouseHoverTransDisplay: e.target.value });
    },
    [updateMouseHoverSetting]
  );

  // 悬浮查词黑名单 (正则/字符串规则匹配) 文本变化回调
  const handleBlacklistChange = useCallback(
    (e) => {
      const { value } = e.target;
      updateMouseHoverSetting({ blacklist: value });
    },
    [updateMouseHoverSetting]
  );

  const handleDisplayModeChange = useCallback(
    (e) => {
      updateMouseHoverSetting({ displayMode: e.target.value });
    },
    [updateMouseHoverSetting]
  );

  const handleBubbleStyleChange = useCallback(
    (e) => {
      updateMouseHoverSetting({ bubbleStyle: e.target.value });
    },
    [updateMouseHoverSetting]
  );

  // 解构当前鼠标悬停状态配置
  const {
    useMouseHover = true,
    mouseHoverKey = DEFAULT_MOUSEHOVER_KEY,
    mouseHoverKey2 = [],
    mouseHoverKeyHold = false,
    mouseHoverKey2Hold = false,
    mouseHoverHoldDelay = 800,
    mouseHoverTransMode = OPT_MOUSE_HOVER_TRANS_AREA,
    mouseHoverTransDisplay = OPT_MOUSE_HOVER_TRANS_DISPLAY_BLOCK,
    blacklist = "",
    displayMode = OPT_MOUSE_HOVER_DISPLAY_BILINGUAL,
    bubbleStyle = DEFAULT_MOUSE_HOVER_BUBBLE_STYLE,
  } = mouseHoverSetting;

  return (
    <Box>
      <Stack spacing={3}>
        {/* 开关：是否启用鼠标悬停查词翻译功能 */}
        <FormControlLabel
          control={
            <Switch
              size="small"
              name="useMouseHover"
              checked={useMouseHover}
              onChange={() => {
                updateMouseHoverSetting({ useMouseHover: !useMouseHover });
              }}
            />
          }
          label={i18n("use_mousehover_translation")}
          sx={{ width: "fit-content" }}
        />

        {/* 触发按键配置格栅区域 */}
        <Box>
          <Grid container spacing={2} columns={12}>
            {/* 首选悬浮快捷键录入框 */}
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Stack spacing={1}>
                <ShortcutInput
                  value={mouseHoverKey}
                  onChange={handleShortcutInput}
                  label={i18n("trigger_trans_shortcut")}
                  helperText={i18n("mousehover_key_help")}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      name="mouseHoverKeyHold"
                      checked={mouseHoverKeyHold}
                      onChange={(e) => handleHoldKeyChange(e.target.checked)}
                    />
                  }
                  label={i18n("mousehover_hold_key")}
                  sx={{ width: "fit-content" }}
                />
              </Stack>
            </Grid>
            {/* 备用悬浮快捷键录入框 */}
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Stack spacing={1}>
                <ShortcutInput
                  value={mouseHoverKey2}
                  onChange={handleAltShortcutInput}
                  label={`${i18n("trigger_trans_shortcut")} (Alternative)`}
                  helperText={i18n("mousehover_key_help")}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      name="mouseHoverKey2Hold"
                      checked={mouseHoverKey2Hold}
                      onChange={(e) => handleAltHoldKeyChange(e.target.checked)}
                    />
                  }
                  label={i18n("mousehover_hold_key")}
                  sx={{ width: "fit-content" }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {(mouseHoverKeyHold || mouseHoverKey2Hold) && (
          <TextField
            size="small"
            type="number"
            inputProps={{ min: 0, step: 50 }}
            label={i18n("mousehover_hold_delay")}
            helperText={i18n("mousehover_hold_delay_helper")}
            name="mouseHoverHoldDelay"
            value={mouseHoverHoldDelay}
            onChange={handleHoldDelayChange}
          />
        )}

        {(mouseHoverKeyHold || mouseHoverKey2Hold) && (
          <TextField
            fullWidth
            select
            size="small"
            name="mouseHoverTransMode"
            value={mouseHoverTransMode}
            label={i18n("mousehover_hold_scope")}
            helperText={i18n("mousehover_hold_scope_helper")}
            onChange={handleTransModeChange}
          >
            <MenuItem value={OPT_MOUSE_HOVER_TRANS_PARAGRAPH}>
              {i18n("mousehover_hold_scope_paragraph")}
            </MenuItem>
            <MenuItem value={OPT_MOUSE_HOVER_TRANS_AREA}>
              {i18n("mousehover_hold_scope_area")}
            </MenuItem>
          </TextField>
        )}

        {(mouseHoverKeyHold || mouseHoverKey2Hold) && (
          <TextField
            fullWidth
            select
            size="small"
            name="mouseHoverTransDisplay"
            value={mouseHoverTransDisplay}
            label={i18n("mousehover_hold_display")}
            helperText={i18n("mousehover_hold_display_helper")}
            onChange={handleTransDisplayChange}
          >
            <MenuItem value={OPT_MOUSE_HOVER_TRANS_DISPLAY_BLOCK}>
              {i18n("mousehover_hold_display_block")}
            </MenuItem>
            <MenuItem value={OPT_MOUSE_HOVER_TRANS_DISPLAY_INLINE}>
              {i18n("mousehover_hold_display_inline")}
            </MenuItem>
          </TextField>
        )}

        {(mouseHoverKeyHold || mouseHoverKey2Hold) && (
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>
            {i18n("mousehover_hold_key_helper")}
          </Box>
        )}

        <Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <TextField
                fullWidth
                select
                size="small"
                name="displayMode"
                value={displayMode}
                label={i18n("mousehover_display_mode")}
                onChange={handleDisplayModeChange}
              >
                <MenuItem value={OPT_MOUSE_HOVER_DISPLAY_BILINGUAL}>
                  {i18n("mousehover_display_bilingual")}
                </MenuItem>
                <MenuItem value={OPT_MOUSE_HOVER_DISPLAY_BUBBLE}>
                  {i18n("mousehover_display_bubble")}
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {displayMode === OPT_MOUSE_HOVER_DISPLAY_BUBBLE && (
          <TextField
            size="small"
            label={i18n("mousehover_bubble_style")}
            helperText={i18n("mousehover_bubble_style_helper")}
            name="bubbleStyle"
            value={bubbleStyle}
            onChange={handleBubbleStyleChange}
            maxRows={12}
            multiline
          />
        )}

        {/* 黑名单域名/规则排除输入框 (一行一条规则) */}
        <TextField
          size="small"
          label={i18n("blacklist")}
          helperText={i18n("pattern_helper")}
          name="blacklist"
          value={blacklist}
          onChange={handleBlacklistChange}
          maxRows={10}
          multiline
        />
      </Stack>
    </Box>
  );
}
