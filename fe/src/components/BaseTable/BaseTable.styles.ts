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

