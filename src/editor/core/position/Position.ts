import { ElementType, RowFlex, VerticalAlign } from '../..'
import { ZERO } from '../../dataset/constant/Common'
import { ControlComponent, ImageDisplay } from '../../dataset/enum/Control'
import { IComputePageRowPositionPayload, IComputePageRowPositionResult } from '../../interface/Position'
import { IEditorOption } from '../../interface/Editor'
import { IElement, IElementPosition } from '../../interface/Element'
import { ICurrentPosition, IGetPositionByXYPayload, IPositionContext } from '../../interface/Position'
import { Draw } from '../draw/Draw'
import { EditorZone } from '../../dataset/enum/Editor'

export class Position {

  private cursorPosition: IElementPosition | null
  private positionContext: IPositionContext
  private positionList: IElementPosition[]

  private draw: Draw
  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    this.positionList = []
    this.cursorPosition = null
    this.positionContext = {
      isTable: false,
      isControl: false
    }

    this.draw = draw
    this.options = draw.getOptions()
  }

  public getTablePositionList(sourceElementList: IElement[]): IElementPosition[] {
    const { index, trIndex, tdIndex } = this.positionContext
    return sourceElementList[index!].trList![trIndex!].tdList[tdIndex!].positionList || []
  }

  public getPositionList(): IElementPosition[] {
    return this.positionContext.isTable
      ? this.getTablePositionList(this.draw.getOriginalElementList())
      : this.getOriginalPositionList()
  }

  public getMainPositionList(): IElementPosition[] {
    return this.positionContext.isTable
      ? this.getTablePositionList(this.draw.getOriginalMainElementList())
      : this.positionList
  }

  public getOriginalPositionList(): IElementPosition[] {
    const zoneManager = this.draw.getZone()
    const header = this.draw.getHeader()
    return zoneManager.isHeaderActive() ? header.getPositionList() : this.positionList
  }

  public getOriginalMainPositionList(): IElementPosition[] {
    return this.positionList
  }

  public setPositionList(payload: IElementPosition[]) {
    this.positionList = payload
  }

  public computePageRowPosition(payload: IComputePageRowPositionPayload): IComputePageRowPositionResult {
    const { positionList, rowList, pageNo, startX, startY, startIndex, innerWidth } = payload
    const { scale, tdPadding } = this.options
    let x = startX
    let y = startY
    let index = startIndex
    for (let i = 0; i < rowList.length; i++) {
      const curRow = rowList[i]
      // 计算行偏移量（行居中、居右）
      if (curRow.rowFlex === RowFlex.CENTER) {
        x += (innerWidth - curRow.width) / 2
      } else if (curRow.rowFlex === RowFlex.RIGHT) {
        x += innerWidth - curRow.width
      }
      // 当前td所在位置
      const tablePreX = x
      const tablePreY = y
      for (let j = 0; j < curRow.elementList.length; j++) {
        const element = curRow.elementList[j]
        const metrics = element.metrics
        const offsetY =
          (element.imgDisplay !== ImageDisplay.INLINE && element.type === ElementType.IMAGE)
            || element.type === ElementType.LATEX
            ? curRow.ascent - metrics.height
            : curRow.ascent
        const positionItem: IElementPosition = {
          pageNo,
          index,
          value: element.value,
          rowNo: i,
          metrics,
          ascent: offsetY,
          lineHeight: curRow.height,
          isLastLetter: j === curRow.elementList.length - 1,
          coordinate: {
            leftTop: [x, y],
            leftBottom: [x, y + curRow.height],
            rightTop: [x + metrics.width, y],
            rightBottom: [x + metrics.width, y + curRow.height]
          }
        }
        positionList.push(positionItem)
        index++
        x += metrics.width
        // 计算表格内元素位置
        if (element.type === ElementType.TABLE) {
          const tdGap = tdPadding * 2
          for (let t = 0; t < element.trList!.length; t++) {
            const tr = element.trList![t]
            for (let d = 0; d < tr.tdList!.length; d++) {
              const td = tr.tdList[d]
              td.positionList = []
              const rowList = td.rowList!
              const drawRowResult = this.computePageRowPosition({
                positionList: td.positionList,
                rowList,
                pageNo,
                startIndex: 0,
                startX: (td.x! + tdPadding) * scale + tablePreX,
                startY: td.y! * scale + tablePreY,
                innerWidth: (td.width! - tdGap) * scale
              })
              // 垂直对齐方式
              if (
                td.verticalAlign === VerticalAlign.MIDDLE
                || td.verticalAlign == VerticalAlign.BOTTOM
              ) {
                const rowsHeight = rowList.reduce((pre, cur) => pre + cur.height, 0)
                const blankHeight = td.height! - tdGap - rowsHeight
                const offsetHeight = td.verticalAlign === VerticalAlign.MIDDLE ? blankHeight / 2 : blankHeight
                if (Math.floor(offsetHeight) > 0) {
                  td.positionList.forEach(tdPosition => {
                    const { coordinate: { leftTop, leftBottom, rightBottom, rightTop } } = tdPosition
                    leftTop[1] += offsetHeight
                    leftBottom[1] += offsetHeight
                    rightBottom[1] += offsetHeight
                    rightTop[1] += offsetHeight
                  })
                }
              }
              x = drawRowResult.x
              y = drawRowResult.y
            }
          }
          // 恢复初始x、y
          x = tablePreX
          y = tablePreY
        }
      }
      x = startX
      y += curRow.height
    }
    return { x, y, index }
  }

  public computePositionList() {
    // 置空原位置信息
    this.positionList = []
    // 按每页行计算
    const innerWidth = this.draw.getInnerWidth()
    const pageRowList = this.draw.getPageRowList()
    const margins = this.draw.getMargins()
    const startX = margins[3]
    // 起始位置受页眉影响
    const header = this.draw.getHeader()
    const extraHeight = header.getExtraHeight()
    const startY = margins[0] + extraHeight
    for (let i = 0; i < pageRowList.length; i++) {
      const rowList = pageRowList[i]
      const startIndex = rowList[0].startIndex
      this.computePageRowPosition({
        positionList: this.positionList,
        rowList,
        pageNo: i,
        startIndex,
        startX,
        startY,
        innerWidth
      })
    }
  }

  public setCursorPosition(position: IElementPosition | null) {
    this.cursorPosition = position
  }

  public getCursorPosition(): IElementPosition | null {
    return this.cursorPosition
  }

  public getPositionContext(): IPositionContext {
    return this.positionContext
  }

  public setPositionContext(payload: IPositionContext) {
    this.positionContext = payload
  }

  public getPositionByXY(payload: IGetPositionByXYPayload): ICurrentPosition {
    const { x, y, isTable } = payload
    let { elementList, positionList } = payload
    if (!elementList) {
      elementList = this.draw.getOriginalElementList()
    }
    if (!positionList) {
      positionList = this.getOriginalPositionList()
    }
    const zoneManager = this.draw.getZone()
    const curPageNo = this.draw.getPageNo()
    const positionNo = zoneManager.isMainActive() ? curPageNo : 0
    for (let j = 0; j < positionList.length; j++) {
      const { index, pageNo, coordinate: { leftTop, rightTop, leftBottom } } = positionList[j]
      if (positionNo !== pageNo) continue
      // 命中元素
      if (leftTop[0] <= x && rightTop[0] >= x && leftTop[1] <= y && leftBottom[1] >= y) {
        let curPositionIndex = j
        const element = elementList[j]
        // 表格被命中
        if (element.type === ElementType.TABLE) {
          for (let t = 0; t < element.trList!.length; t++) {
            const tr = element.trList![t]
            for (let d = 0; d < tr.tdList.length; d++) {
              const td = tr.tdList[d]
              const tablePosition = this.getPositionByXY({
                x,
                y,
                td,
                tablePosition: positionList[j],
                isTable: true,
                elementList: td.value,
                positionList: td.positionList
              })
              if (~tablePosition.index) {
                const { index: tdValueIndex } = tablePosition
                const tdValueElement = td.value[tdValueIndex]
                return {
                  index,
                  isCheckbox: tdValueElement.type === ElementType.CHECKBOX ||
                    tdValueElement.controlComponent === ControlComponent.CHECKBOX,
                  isControl: tdValueElement.type === ElementType.CONTROL,
                  isImage: tablePosition.isImage,
                  isDirectHit: tablePosition.isDirectHit,
                  isTable: true,
                  tdIndex: d,
                  trIndex: t,
                  tdValueIndex,
                  tdId: td.id,
                  trId: tr.id,
                  tableId: element.id
                }
              }
            }
          }
        }
        // 图片区域均为命中
        if (element.type === ElementType.IMAGE || element.type === ElementType.LATEX) {
          return {
            index: curPositionIndex,
            isDirectHit: true,
            isImage: true
          }
        }
        if (
          element.type === ElementType.CHECKBOX ||
          element.controlComponent === ControlComponent.CHECKBOX
        ) {
          return {
            index: curPositionIndex,
            isDirectHit: true,
            isCheckbox: true
          }
        }
        // 判断是否在文字中间前后
        if (elementList[index].value !== ZERO) {
          const valueWidth = rightTop[0] - leftTop[0]
          if (x < leftTop[0] + valueWidth / 2) {
            curPositionIndex = j - 1
          }
        }
        return {
          index: curPositionIndex,
          isControl: element.type === ElementType.CONTROL,
        }
      }
    }
    // 非命中区域
    let isLastArea = false
    let curPositionIndex = -1
    // 判断是否在表格内
    if (isTable) {
      const { scale } = this.options
      const { td, tablePosition } = payload
      if (td && tablePosition) {
        const { leftTop } = tablePosition.coordinate
        const tdX = td.x! * scale + leftTop[0]
        const tdY = td.y! * scale + leftTop[1]
        const tdWidth = td.width! * scale
        const tdHeight = td.height! * scale
        if (!(tdX < x && x < tdX + tdWidth && tdY < y && y < tdY + tdHeight)) {
          return {
            index: curPositionIndex
          }
        }
      }
    }
    // 判断所属行是否存在元素
    const firstLetterList = positionList.filter(p => p.isLastLetter && p.pageNo === positionNo)
    for (let j = 0; j < firstLetterList.length; j++) {
      const { index, pageNo, coordinate: { leftTop, leftBottom } } = firstLetterList[j]
      if (positionNo !== pageNo) continue
      if (y > leftTop[1] && y <= leftBottom[1]) {
        const isHead = x < this.options.margins[3]
        // 是否在头部
        if (isHead) {
          const headIndex = positionList.findIndex(p => p.pageNo === positionNo && p.rowNo === firstLetterList[j].rowNo)
          curPositionIndex = ~headIndex ? headIndex - 1 : index
        } else {
          curPositionIndex = index
        }
        isLastArea = true
        break
      }
    }
    if (!isLastArea) {
      // 判断所属位置是否属于header区域，当前位置小于第一行的上边距
      if (zoneManager.isMainActive()) {
        if (y < firstLetterList[0].coordinate.leftTop[1]) {
          return {
            index: -1,
            zone: EditorZone.HEADER
          }
        }
      }
      // 判断所属位置是否属于main区域，当前位置大于第一行的上边距
      if (zoneManager.isHeaderActive()) {
        if (y > firstLetterList[0].coordinate.leftTop[1]) {
          return {
            index: -1,
            zone: EditorZone.MAIN
          }
        }
      }
      // 当前页最后一行
      return {
        index: firstLetterList[firstLetterList.length - 1]?.index || positionList.length - 1,
      }
    }
    return {
      index: curPositionIndex,
      isControl: elementList[curPositionIndex]?.type === ElementType.CONTROL
    }
  }

  public adjustPositionContext(payload: IGetPositionByXYPayload): ICurrentPosition | null {
    const isReadonly = this.draw.isReadonly()
    const positionResult = this.getPositionByXY(payload)
    if (!~positionResult.index) return null
    // 移动控件内光标
    if (positionResult.isControl && !isReadonly) {
      const {
        index,
        isTable,
        trIndex,
        tdIndex,
        tdValueIndex
      } = positionResult
      const control = this.draw.getControl()
      const { newIndex } = control.moveCursor({
        index,
        isTable,
        trIndex,
        tdIndex,
        tdValueIndex
      })
      if (isTable) {
        positionResult.tdValueIndex = newIndex
      } else {
        positionResult.index = newIndex
      }
    }
    const {
      index,
      isCheckbox,
      isControl,
      isTable,
      trIndex,
      tdIndex,
      tdId,
      trId,
      tableId
    } = positionResult
    // 设置位置上下文
    this.setPositionContext({
      isTable: isTable || false,
      isCheckbox: isCheckbox || false,
      isControl: isControl || false,
      index,
      trIndex,
      tdIndex,
      tdId,
      trId,
      tableId
    })
    return positionResult
  }

}