import styled from "styled-components"

export const BaseTableWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;

    .ant-card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
`

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
  flex-shrink: 0;
`

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`

export const TableWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
`

export const PaginationWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
