import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

// my-class란 class가 항상 적용된 컴포넌트를 렌더링
// beforeEach(async () => {
//   await render(<TextField className="my-class" />);
// });
it('className prop으로 설정한 css class가 적용된다.', async () => {
  // Arrange - 테스트를 위한 환경 만들기
  // -> className을 지닌 컴포넌트 렌더링
  // Act - 테스트할 동작 발생
  // -> 렌더링에 대한 검증이기 때문에 이 단계는 생략
  // -> 클릭이나 메서드 호출, prop 변경 등등에 대한 작업이 여기에 해당
  // Assert - 올바른 동작이 실행되었는지 검증
  // -> 렌더링 후에 DOM에 해당 class가 존재하는지 검증

  // render API를 호출 -> 테스트 환경의 jsDOM에 리액트 컴포넌트가 렌더링된 DOM 구조가 반영
  // jsDOM: Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현
  await render(<TextField className="my-class" />);

  // vitest의 expect 함수를 사용하여 기대 결과를 검증

  // className이란 내부 prop이나 state 값을 검증 (X)
  // 렌더링되는 DOM 구조가 올바르게 변경되었는지 확인 (O) -> 최종적으로 사용자가 보는 결과는 DOM

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  screen.debug();

  expect(textInput).toHaveClass('my-class');
});

describe('placeholder', () => {
  it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    screen.debug();

    expect(textInput).toBeInTheDocument();
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해 주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

    expect(textInput).toBeInTheDocument();
  });

  it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
    const spy = vi.fn(); // 스파이 함수: 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지 어떤 값을 반환하는지
    const { user } = await render(<TextField onChange={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.type(textInput, 'test'); // type은 키다운 이벤트를 발생시킴

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('엔터키를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
    const spy = vi.fn();

    const { user } = await render(<TextField onEnter={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.type(textInput, 'test{Enter}');

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
    // 포커스 활성화
    // 탭 키로 인풋 요소로 포커스 이동
    // 인풋 요소를 클릭했을 때
    // textInput.focus()로 직접 발생
    const spy = vi.fn();

    const { user } = await render(<TextField onFocus={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.click(textInput);
    // click과 연관 -> 포커스, 마우스다운, 마우스 업 등...

    expect(spy).toHaveBeenCalled(); // spy함수가 호출되었는지만 확인하는 매처
  });

  it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
    const { user } = await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.click(textInput);

    expect(textInput).toHaveStyle({
      borderWidth: '2px',
      borderColor: 'rgb(25, 118, 210)',
    });
  });
});