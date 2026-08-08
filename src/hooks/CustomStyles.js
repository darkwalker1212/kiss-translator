import { useCallback, useMemo } from "react";
import { useSetting } from "./Setting";
import { DEFAULT_CUSTOM_STYLES, OPT_STYLE_ALL } from "../config/styles";
import { builtinStylesMap } from "../libs/style";
import { useI18n } from "./I18n";

// 内部状态 Hook，解构并提供用户自定义样式列表和更新方法
function useStyleState() {
  const { setting, updateSetting } = useSetting();
  const customStyles = setting?.customStyles || [];

  return { customStyles, updateSetting };
}

/**
 * 用户自定义样式列表管理的自定义 Hook
 */
export function useStyleList() {
  const { customStyles, updateSetting } = useStyleState();

  // 添加新的自定义 CSS 样式项，预设为样式模版中的第一个样式并生成新的 UUID 作为标识
  const addStyle = useCallback(() => {
    const defaultStyle = DEFAULT_CUSTOM_STYLES[0];
    const uuid = crypto.randomUUID();
    const styleSlug = `custom_${crypto.randomUUID()}`;
    const styleName = `Style_${uuid.slice(0, 8)}`;
    const newStyle = {
      ...defaultStyle,
      styleSlug,
      styleName,
    };
    updateSetting((prev) => ({
      ...prev,
      customStyles: [...(prev?.customStyles || []), newStyle],
    }));
  }, [updateSetting]);

  // 删除特定的自定义 CSS 样式项
  const deleteStyle = useCallback(
    (styleSlug) => {
      updateSetting((prev) => ({
        ...prev,
        customStyles: (prev?.customStyles || []).filter(
          (item) => item.styleSlug !== styleSlug
        ),
      }));
    },
    [updateSetting]
  );

  // 更新特定样式的属性数据（例如 styleName 或 styleCode 等）。
  // 若目标是系统内置样式（如 under_line），首次编辑时会把覆盖配置写入
  // customStyles，后续翻译渲染会优先使用覆盖后的 CSS。
  const updateStyle = useCallback(
    (styleSlug, updateData) => {
      updateSetting((prev) => {
        const customStyles = prev?.customStyles || [];
        const exists = customStyles.some(
          (item) => item.styleSlug === styleSlug
        );
        if (exists) {
          return {
            ...prev,
            customStyles: customStyles.map((item) =>
              item.styleSlug === styleSlug ? { ...item, ...updateData } : item
            ),
          };
        }
        // 内置样式第一次编辑时生成覆盖条目
        const base = OPT_STYLE_ALL.includes(styleSlug)
          ? {
              styleSlug,
              styleName: "",
              styleCode: builtinStylesMap[styleSlug] || "",
            }
          : {};
        return {
          ...prev,
          customStyles: [...customStyles, { ...base, ...updateData }],
        };
      });
    },
    [updateSetting]
  );

  return {
    customStyles,
    addStyle,
    deleteStyle,
    updateStyle,
  };
}

/**
 * 获取系统内置及用户自定义所有文本样式的自定义 Hook
 */
export function useAllTextStyles() {
  const { customStyles } = useStyleList();
  const i18n = useI18n();

  // 内置样式覆盖表：用户编辑过某个内置样式时，以覆盖内容为准
  const overrideMap = useMemo(
    () => new Map(customStyles.map((item) => [item.styleSlug, item])),
    [customStyles]
  );

  // 获取本地化的系统内置文本样式列表（已合并用户对内置样式的覆盖）
  const builtinStyles = useMemo(() => {
    return OPT_STYLE_ALL.map((styleSlug) => {
      const override = overrideMap.get(styleSlug);
      return {
        styleSlug,
        styleName: override?.styleName || i18n(styleSlug),
        styleCode: override?.styleCode ?? (builtinStylesMap[styleSlug] || ""),
      };
    });
  }, [i18n, overrideMap]);

  // 拼接系统内置（含覆盖）和用户自定义样式，生成用于界面展示的所有文本样式集合
  const allTextStyles = useMemo(() => {
    return [
      ...builtinStyles,
      ...customStyles.filter(
        (item) => !OPT_STYLE_ALL.includes(item.styleSlug)
      ),
    ];
  }, [builtinStyles, customStyles]);

  return { builtinStyles, customStyles, allTextStyles };
}
